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
    (matcherNode.name === "toHaveLength" && matcherArguments[0].value === 0)
  );
}

function check(
  context,
  { queryNode, matcherNode, matcherArguments, negatedMatcher }
) {
  const query = queryNode.name || queryNode.property.name;

  // toHaveLength() is only invalid with 0 or 1
  if (matcherNode.name === "toHaveLength" && matcherArguments[0].value > 1) {
    return;
  }

  if (queries.includes(query)) {
    context.report({
      node: matcherNode,
      messageId: "use-document",
      loc: matcherNode.loc,
      fix(fixer) {
        const operations = [];

        // Flip the .not if neccessary
        if (isAntonymMatcher(matcherNode, matcherArguments)) {
          if (negatedMatcher) {
            operations.push(
              fixer.removeRange([
                matcherNode.range[0] - 5,
                matcherNode.range[0] - 1,
              ])
            );
          } else {
            operations.push(fixer.insertTextBefore(matcherNode, "not."));
          }
        }

        // Replace the actual matcher
        operations.push(fixer.replaceText(matcherNode, "toBeInTheDocument"));

        // Remove any arguments in the matcher
        for (const argument of matcherArguments) {
          operations.push(fixer.remove(argument));
        }

        return operations;
      },
    });
  }
}

export const create = (context) => {
  const alternativeMatchers = /(toHaveLength|toBeDefined|toBeNull)/;

  return {
    // Grabbing expect(<query>).not.<matcher>
    [`CallExpression[callee.object.object.callee.name='expect'][callee.object.property.name='not'][callee.property.name=${alternativeMatchers}]`](
      node
    ) {
      const queryNode = node.callee.object.object.arguments[0].callee;
      const matcherNode = node.callee.property;
      const matcherArguments = node.arguments;

      check(context, {
        negatedMatcher: true,
        queryNode,
        matcherNode,
        matcherArguments,
      });
    },

    // Grabbing expect(<query>).<matcher>
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
