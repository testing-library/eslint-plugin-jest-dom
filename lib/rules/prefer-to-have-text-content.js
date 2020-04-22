/**
 * @fileoverview prefer toHaveAttribute over checking  getAttribute/hasAttribute
 * @author Ben Monro
 */
"use strict";

module.exports = {
  meta: {
    docs: {
      description: "Prefer toHaveTextContent over checking element.textContent",
      recommended: true
    },
    fixable: "code"
  },

  create: function(context) {
    return {
      [`MemberExpression[property.name='textContent'][parent.callee.name='expect'][parent.parent.property.name=/toContain$|toMatch$/]`](
        node
      ) {
        const expectedArg = node.parent.parent.parent.arguments[0];
        context.report({
          node: node.parent,
          message: `Use toHaveTextContent instead of asserting on DOM node attributes`,
          fix(fixer) {
            return [
              fixer.removeRange([
                node.property.range[0] - 1,
                node.property.range[1]
              ]),
              fixer.replaceTextRange(
                node.parent.parent.property.range,
                "toHaveTextContent"
              ),
              fixer.replaceTextRange(
                expectedArg.range,
                `/${expectedArg.value}/`
              )
            ];
          }
        });
      },
      [`MemberExpression[property.name='textContent'][parent.callee.name='expect'][parent.parent.property.name=/toBe$|to(Strict)?Equal/]`](
        node
      ) {
        context.report({
          node: node.parent,
          message: `Use toHaveTextContent instead of asserting on DOM node attributes`,
          fix(fixer) {
            return [
              fixer.removeRange([
                node.property.range[0] - 1,
                node.property.range[1]
              ]),
              fixer.replaceTextRange(
                node.parent.parent.property.range,
                "toHaveTextContent"
              )
            ];
          }
        });
      },
      [`MemberExpression[property.name='textContent'][parent.callee.name='expect'][parent.parent.property.name='not'][parent.parent.parent.property.name=/toBe$|to(Strict)?Equal/]`](
        node
      ) {
        context.report({
          node: node.parent,
          message: `Use toHaveTextContent instead of asserting on DOM node attributes`,
          fix(fixer) {
            return [
              fixer.removeRange([
                node.property.range[0] - 1,
                node.property.range[1]
              ]),
              fixer.replaceTextRange(
                node.parent.parent.parent.property.range,
                "toHaveTextContent"
              )
            ];
          }
        });
      },
      [`MemberExpression[property.name='textContent'][parent.callee.name='expect'][parent.parent.property.name='not'][parent.parent.parent.property.name=/toContain$|toMatch$/]`](
        node
      ) {
        const expectedArg = node.parent.parent.parent.parent.arguments[0];
        context.report({
          node: node.parent,
          message: `Use toHaveTextContent instead of asserting on DOM node attributes`,
          fix(fixer) {
            return [
              fixer.removeRange([
                node.property.range[0] - 1,
                node.property.range[1]
              ]),
              fixer.replaceTextRange(
                node.parent.parent.parent.property.range,
                "toHaveTextContent"
              ),
              fixer.replaceTextRange(
                expectedArg.range,
                `/${expectedArg.value}/`
              )
            ];
          }
        });
      }
    };
  }
};
