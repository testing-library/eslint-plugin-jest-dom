/**
 * @fileoverview prefer toBeInTheDocument over checking getAttribute/hasAttribute
 * @author Anton Niklasson
 */

import { queries } from "../queries";

export const meta = {
  type: "suggestion",
  docs: {
    category: "jest-dom",
    description:
      "Prefer .toBeInTheDocument() for asserting the existence of a DOM node",
    url: "prefer-in-document",
    recommended: false,
  },
  fixable: "code",
  messages: {
    "use-document": `Prefer .toBeInTheDocument() for asserting DOM node existence`,
  },
};

function isAntonymMatcher(matcherNode, matcherArguments) {
  return (
    matcherNode.name === "toBeNull" ||
    (matcherNode.name === "toHaveLength" && matcherArguments[0].value === 0)
  );
}

function check(
  context,
  { queryNode, matcherNode, matcherArguments, negatedMatcher, expect }
) {
  if (!queryNode || (!queryNode.name && !queryNode.property)) return;
  // toHaveLength() is only invalid with 0 or 1
  if (matcherNode.name === "toHaveLength" && matcherArguments[0].value > 1) {
    return;
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

export const create = (context) => {
  const alternativeMatchers = /(toHaveLength|toBeDefined|toBeNull)/;
  function getQueryNodeFromAssignment(identifierName) {
    const variable = context.getScope().set.get(identifierName);
    const init = variable.defs[0].node.init;

    let queryNode;
    if (init) {
      // let foo = screen.<query>();
      queryNode = init.callee.property || init.callee;
    } else {
      // let foo;
      // foo = screen.<query>();
      const assignmentRef = variable.references
        .reverse()
        .find((ref) => !!ref.writeExpr);
      if (!assignmentRef) {
        return;
      }
      queryNode =
        assignmentRef.writeExpr.type === "CallExpression"
          ? assignmentRef.writeExpr.callee
          : assignmentRef.writeExpr;
    }
    return queryNode;
  }
  return {
    // expect(<query>).not.<matcher>
    [`CallExpression[callee.object.object.callee.name='expect'][callee.object.property.name='not'][callee.property.name=${alternativeMatchers}]`](
      node
    ) {
      const queryNode = node.callee.object.object.arguments[0].callee;
      const matcherNode = node.callee.property;
      const matcherArguments = node.arguments;

      const expect = node.callee.object.object;
      check(context, {
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
      const queryNode = getQueryNodeFromAssignment(
        node.object.object.arguments[0].name
      );
      const matcherNode = node.property;

      const matcherArguments = node.parent.arguments;

      const expect = node.object.object;

      check(context, {
        negatedMatcher: true,
        queryNode,
        matcherNode,
        matcherArguments,
        expect,
      });
    },
    // const foo = <query> expect(foo).<matcher>
    [`MemberExpression[object.callee.name=expect][property.name=${alternativeMatchers}][object.arguments.0.type=Identifier]`](
      node
    ) {
      const queryNode = getQueryNodeFromAssignment(
        node.object.arguments[0].name
      );
      const matcherNode = node.property;

      const matcherArguments = node.parent.arguments;

      check(context, {
        negatedMatcher: false,
        queryNode,
        matcherNode,
        matcherArguments,
      });
    },
    // expect(<query>).<matcher>
    [`CallExpression[callee.object.callee.name='expect'][callee.property.name=${alternativeMatchers}]`](
      node
    ) {
      const queryNode = node.callee.object.arguments[0].callee;
      const matcherNode = node.callee.property;
      const matcherArguments = node.arguments;

      check(context, {
        negatedMatcher: false,
        queryNode,
        matcherNode,
        matcherArguments,
      });
    },
  };
};
