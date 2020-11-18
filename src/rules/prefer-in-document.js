/**
 * @fileoverview prefer toBeInTheDocument over checking getAttribute/hasAttribute
 * @author Anton Niklasson
 */

import { queries } from "../queryNames";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const meta = {
  type: "suggestion",
  docs: {
    category: "jest-dom",
    description:
      "Prefer .toBeInTheDocument() in favor of checking the length of the result using .toHaveLength(1)",
    url: "prefer-in-document",
    recommended: false,
  },
  fixable: "code",
  messages: {
    useDocument: `Prefer .toBeInTheDocument() in favor of .toHaveLength(1)`,
  },
};

/* eslint-disable no-console */

export const create = (context) => {
  return {
    [`CallExpression[callee.object.callee.name='expect'][callee.property.name='toHaveLength'][arguments.0.value=1]`](
      node
    ) {
      const queryNode = node.callee.object.arguments[0].callee;
      const query = queryNode.name || queryNode.property.name;
      const toHaveLengthNode = node.callee.property;

      if (queries.includes(query)) {
        context.report({
          node: node.callee,
          messageId: "useDocument",
          loc: toHaveLengthNode.loc,
          fix(fixer) {
            return [
              fixer.replaceText(toHaveLengthNode, "toBeInTheDocument"),
              fixer.remove(node.arguments[0]),
            ];
          },
        });
      }
    },
  };
};
