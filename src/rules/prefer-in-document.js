/**
 * @fileoverview prefer toBeInTheDocument over checking getAttribute/hasAttribute
 * @author Anton Niklasson
 */

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
  messages: {
    useDocument: `Prefer .toBeInTheDocument() in favor of .toHaveLength(1)`,
  },
};

/* eslint-disable no-console */

const queryStrats = [
  "ByLabelText",
  "ByPlaceholderText",
  "ByText",
  "ByAltText",
  "ByTitle",
  "ByDisplayValue",
  "ByRole",
  "ByTestId",
];
const queries = [
  "get",
  "getAll",
  "query",
  "queryAll",
  "find",
  "findAll",
].reduce((acc, q) => {
  return [...acc, ...queryStrats.map((qs) => q + qs)];
}, []);

export const create = (context) => {
  return {
    [`ExpressionStatement[expression.arguments.0.value=1][expression.callee.object.callee.name='expect'][expression.callee.property.name='toHaveLength']`](
      node
    ) {
      const screenQuery =
        node.expression.callee.object.arguments[0].callee.property.name;

      if (queries.includes(screenQuery)) {
        context.report({
          node: node.expression.callee.property,
          messageId: "useDocument",
        });
      }
    },
  };
};
