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
  },
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
  return matcherNode.name === "toHaveLength" && matcherArguments[0].value === 0;
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

    // toHaveLength() is only invalid with 0 or 1
    if (matcherNode.name === "toHaveLength" && matcherArguments.length) {
      const lengthValue = getLengthValue(matcherArguments);
      // isNotToHaveLengthZero represents .not.toHaveLength(0) which is a valid use of toHaveLength
      const isNotToHaveLengthZero =
        usesToHaveLengthZero(matcherNode, matcherArguments) && negatedMatcher;

      const isValidUseOfToHaveLength =
        // .toHaveLength(1) is valid when used with *AllBy* queries
        // meaning checking for exactly one match
        // see discussion https://github.com/testing-library/eslint-plugin-jest-dom/issues/171
        (lengthValue === 1 && /AllBy/.test(queryNode.name)) ||
        isNotToHaveLengthZero ||
        !["Literal", "Identifier"].includes(matcherArguments[0].type) ||
        lengthValue === undefined ||
        lengthValue > 1;

      if (isValidUseOfToHaveLength) {
        return;
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
