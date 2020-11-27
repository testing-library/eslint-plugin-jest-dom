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
  { subject, matcherNode, matcherArguments, negatedMatcher }
) {
  let query;

  if (subject.type === "Identifier") {
    // Backtrack the variable to see if it was populated by a query.
    try {
      const variable = context
        .getScope()
        .variables.find((v) => v.name === subject.name).defs[0].node.init;
      query = variable.callee.name || variable.callee.property.name;
    } catch (error) {
      return;
    }
  } else if (subject.type !== "CallExpression") {
    return;
  }

  // toHaveLength() is only invalid with 0 or 1
  if (matcherNode.name === "toHaveLength" && matcherArguments[0].value > 1) {
    return;
  }

  if (!query) {
    query = subject.callee.name || subject.callee.property.name;
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
      const subject = node.callee.object.object.arguments[0];
      const matcherNode = node.callee.property;
      const matcherArguments = node.arguments;

      check(context, {
        negatedMatcher: true,
        subject,
        matcherNode,
        matcherArguments,
      });
    },

    // Grabbing expect(<query>).<matcher>
    [`CallExpression[callee.object.callee.name='expect'][callee.property.name=${alternativeMatchers}]`](
      node
    ) {
      const subject = node.callee.object.arguments[0];
      const matcherNode = node.callee.property;
      const matcherArguments = node.arguments;

      check(context, {
        negatedMatcher: false,
        subject,
        matcherNode,
        matcherArguments,
      });
    },
  };
};
