/**
 * @fileoverview prefer toBeInTheDocument over checking getAttribute/hasAttribute
 * @author Anton Niklasson
 */

/*eslint complexity: ["error", {"max": 20}]*/

import { queries } from "../queries";
import { getAssignmentForIdentifier } from "../assignment-ast";

export const meta = {
  type: "suggestion",
  docs: {
    category: "Best Practices",
    description:
      "Prefer .toBeInTheDocument() for asserting the existence of a DOM node",
    url: "prefer-in-document",
    recommended: true,
  },
  fixable: "code",
  messages: {
    "use-document": `Prefer .toBeInTheDocument() for asserting DOM node existence`,
    "invalid-combination-length-1": `Invalid combination of {{query}} and .toHaveLength(1). Did you mean to use {{allQuery}}?`,
  },
  hasSuggestions: true,
};

function isAntonymMatcher(matcherNode, matcherArguments) {
  return (
    matcherNode.name === "toBeNull" ||
    matcherNode.name === "toBeFalsy" ||
    usesToBeOrToEqualWithNull(matcherNode, matcherArguments) ||
    usesToHaveLengthZero(matcherNode, matcherArguments)
  );
}

function usesToBeOrToEqualWithNull(matcherNode, matcherArguments) {
  return (
    (matcherNode.name === "toBe" || matcherNode.name === "toEqual") &&
    matcherArguments[0].value === null
  );
}

function usesToHaveLengthZero(matcherNode, matcherArguments) {
  // matcherArguments.length === 0: toHaveLength() will cause jest matcher error
  // matcherArguments[0].value:     toHaveLength(0, ...) means zero length
  return (
    matcherNode.name === "toHaveLength" &&
    (matcherArguments.length === 0 || matcherArguments[0].value === 0)
  );
}

/**
 * Extract the DTL query identifier from a call expression
 *
 * <query>() -> <query>
 * screen.<query>() -> <query>
 */
function getDTLQueryIdentifierNode(callExpressionNode) {
  if (!callExpressionNode || callExpressionNode.type !== "CallExpression") {
    return;
  }

  if (callExpressionNode.callee.type === "Identifier") {
    return callExpressionNode.callee;
  }

  return callExpressionNode.callee.property;
}

export const create = (context) => {
  const alternativeMatchers =
    /^(toHaveLength|toBeDefined|toBeNull|toBe|toEqual|toBeTruthy|toBeFalsy)$/;
  function getLengthValue(matcherArguments) {
    let lengthValue;

    if (matcherArguments[0].type === "Identifier") {
      const assignment = getAssignmentForIdentifier(
        context,
        matcherArguments[0].name
      );
      if (!assignment) {
        return;
      }
      lengthValue = assignment.value;
    } else if (matcherArguments[0].type === "Literal") {
      lengthValue = matcherArguments[0].value;
    }

    return lengthValue;
  }
  function check({
    queryNode,
    matcherNode,
    matcherArguments,
    negatedMatcher,
    expect,
  }) {
    if (matcherNode.parent.parent.type !== "CallExpression") {
      return;
    }

    // only report on dom nodes which we can resolve to RTL queries.
    if (!queryNode || (!queryNode.name && !queryNode.property)) return;

    // *By* query with .toHaveLength(0/1) matcher are considered violations
    //
    // | Selector type | .toHaveLength(1)            | .toHaveLength(0)                      |
    // | ============= | =========================== | ===================================== |
    // | *By* query    | Did you mean to use *AllBy* | Replace with .not.toBeInTheDocument() |
    // | *AllBy* query | Correct                     | Correct
    //
    // @see https://github.com/testing-library/eslint-plugin-jest-dom/issues/171
    //
    if (matcherNode.name === "toHaveLength" && matcherArguments.length === 1) {
      const lengthValue = getLengthValue(matcherArguments);
      const queryName = queryNode.name || queryNode.property.name;

      const isSingleQuery =
        queries.includes(queryName) && !/AllBy/.test(queryName);
      const hasViolation = isSingleQuery && [1, 0].includes(lengthValue);

      if (!hasViolation) {
        return;
      }

      // If length === 1, report violation with suggestions
      // Otherwise fallback to default report
      if (lengthValue === 1) {
        const allQuery = queryName.replace("By", "AllBy");
        return context.report({
          node: matcherNode,
          messageId: "invalid-combination-length-1",
          data: {
            query: queryName,
            allQuery,
          },
          loc: matcherNode.loc,
          suggest: [
            {
              desc: `Replace ${queryName} with ${allQuery}`,
              fix(fixer) {
                return fixer.replaceText(
                  queryNode.property || queryNode,
                  allQuery
                );
              },
            },
            {
              desc: "Replace .toHaveLength(1) with .toBeInTheDocument()",
              fix(fixer) {
                // Remove any arguments in the matcher
                return [
                  ...Array.from(matcherArguments).map((argument) =>
                    fixer.remove(argument)
                  ),
                  fixer.replaceText(matcherNode, "toBeInTheDocument"),
                ];
              },
            },
          ],
        });
      }
    }

    // toBe() or toEqual() are only invalid with null
    if (matcherNode.name === "toBe" || matcherNode.name === "toEqual") {
      if (
        !matcherArguments.length ||
        !usesToBeOrToEqualWithNull(matcherNode, matcherArguments)
      ) {
        return;
      }
    }

    const query = queryNode.name || queryNode.property.name;

    if (queries.includes(query)) {
      context.report({
        node: matcherNode,
        messageId: "use-document",
        loc: matcherNode.loc,
        fix(fixer) {
          const operations = [];

          // Remove any arguments in the matcher
          for (const argument of Array.from(matcherArguments)) {
            const sourceCode = context.getSourceCode();
            const token = sourceCode.getTokenAfter(argument);
            if (token.value === "," && token.type === "Punctuator") {
              // Remove commas if toHaveLength had more than one argument or a trailing comma
              operations.push(fixer.replaceText(token, ""));
            }
            operations.push(fixer.remove(argument));
          }

          // AllBy should not be used with toBeInTheDocument
          operations.push(
            fixer.replaceText(
              queryNode.property || queryNode,
              query.replace("All", "")
            )
          );
          // Flip the .not if necessary
          if (isAntonymMatcher(matcherNode, matcherArguments)) {
            if (negatedMatcher) {
              operations.push(
                fixer.replaceTextRange(
                  [expect.range[1], matcherNode.range[1]],
                  ".toBeInTheDocument"
                )
              );

              return operations;
            } else {
              operations.push(fixer.insertTextBefore(matcherNode, "not."));
            }
          }

          // Replace the actual matcher
          operations.push(fixer.replaceText(matcherNode, "toBeInTheDocument"));

          return operations;
        },
      });
    }
  }

  return {
    // expect(<query>).not.<matcher>
    [`CallExpression[callee.object.object.callee.name='expect'][callee.object.property.name='not'][callee.property.name=${alternativeMatchers}], CallExpression[callee.object.callee.name='expect'][callee.object.property.name='not'][callee.object.arguments.0.argument.callee.name=${alternativeMatchers}]`](
      node
    ) {
      if (!node.callee.object.object.arguments.length) {
        return;
      }

      const arg = node.callee.object.object.arguments[0];
      const queryNode =
        arg.type === "AwaitExpression" ? arg.argument.callee : arg.callee;
      const matcherNode = node.callee.property;
      const matcherArguments = node.arguments;

      const expect = node.callee.object.object;
      check({
        negatedMatcher: true,
        queryNode,
        matcherNode,
        matcherArguments,
        expect,
      });
    },
    // // const foo = <query> expect(foo).not.<matcher>
    [`MemberExpression[object.object.callee.name=expect][object.property.name=not][property.name=${alternativeMatchers}][object.object.arguments.0.type=Identifier]`](
      node
    ) {
      const queryNode = getAssignmentForIdentifier(
        context,
        node.object.object.arguments[0].name
      );

      // Not an RTL query
      if (!queryNode || queryNode.type !== "CallExpression") {
        return;
      }

      const matcherNode = node.property;

      const matcherArguments = node.parent.arguments;

      const expect = node.object.object;
      check({
        negatedMatcher: true,
        queryNode: (queryNode && queryNode.callee) || queryNode,
        matcherNode,
        matcherArguments,
        expect,
      });
    },
    // const foo = <query> expect(foo).<matcher>
    [`MemberExpression[object.callee.name=expect][property.name=${alternativeMatchers}][object.arguments.0.type=Identifier]`](
      node
    ) {
      // Value expression being assigned to the left-hand value
      const rightValueNode = getAssignmentForIdentifier(
        context,
        node.object.arguments[0].name
      );

      // Not a DTL query
      if (!rightValueNode || rightValueNode.type !== "CallExpression") {
        return;
      }

      const queryIdentifierNode = getDTLQueryIdentifierNode(rightValueNode);

      const matcherNode = node.property;

      const matcherArguments = node.parent.arguments;
      check({
        negatedMatcher: false,
        queryNode: queryIdentifierNode,
        matcherNode,
        matcherArguments,
      });
    },
    // expect(await <query>).<matcher>
    // expect(<query>).<matcher>
    [`CallExpression[callee.object.callee.name='expect'][callee.property.name=${alternativeMatchers}], CallExpression[callee.object.callee.name='expect'][callee.object.arguments.0.argument.callee.name=${alternativeMatchers}]`](
      node
    ) {
      const arg = node.callee.object.arguments[0];

      if (!arg) {
        return;
      }

      const queryIdentifierNode =
        arg.type === "AwaitExpression"
          ? getDTLQueryIdentifierNode(arg.argument)
          : getDTLQueryIdentifierNode(arg);

      const matcherNode = node.callee.property;
      const matcherArguments = node.arguments;

      check({
        negatedMatcher: false,
        queryNode: queryIdentifierNode,
        matcherNode,
        matcherArguments,
      });
    },
  };
};
