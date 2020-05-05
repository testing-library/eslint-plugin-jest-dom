/**
 * @fileoverview prefer toHaveFocus over checking activeElementa
 * @author Ben Monro
 */
"use strict";

const variantsOfDoc = [
  // document:
  `[object.name=document]`,
  // window.document || global.document:
  `[object.object.name=/(global|window)$/][object.property.name=document]`,
  // global.window.document:
  `[object.object.object.name='global'][object.object.property.name='window'][object.property.name=document]`
];

module.exports = {
  meta: {
    docs: {
      description: "prefer toHaveFocus over checking document.activeElement",
      category: "jest-dom",
      recommended: true
    },
    fixable: "code"
  },

  create: function(context) {
    return {
      [variantsOfDoc
        .map(
          variant =>
            `MemberExpression${variant}[property.name='activeElement'][parent.parent.object.callee.name='expect'][parent.parent.property.name='not'][parent.parent.parent.property.name=/to(Be|(Strict)?Equal)$/]`
        )
        .join(", ")](node) {
        const element =
          node.parent.parent.parent.parent.callee.parent.arguments[0];
        const matcher = node.parent.parent.parent.parent.callee.property;

        context.report({
          node: node.parent,
          message: `Use toHaveFocus instead of checking activeElement`,
          fix(fixer) {
            if (element.name) {
              return [
                fixer.replaceText(node, element.name),
                fixer.remove(element),
                fixer.replaceText(matcher, "toHaveFocus")
              ];
            } else {
              return [
                fixer.removeRange([node.range[0], element.range[0]]),
                fixer.insertTextAfterRange(
                  [element.range[1], element.range[1] + 1],
                  ".not.toHaveFocus()"
                )
              ];
            }
          }
        });
      },
      [variantsOfDoc
        .map(
          variant =>
            `MemberExpression${variant}[property.name='activeElement'][parent.callee.object.object.callee.name='expect'][parent.callee.property.name=/to(Be|(Strict)?Equal)$/]`
        )
        .join(", ")](node) {
        const matcher = node.parent.callee.property;
        context.report({
          node: node.parent,
          message: `Use toHaveFocus instead of checking activeElement`,
          fix(fixer) {
            return [
              fixer.remove(node),
              fixer.replaceText(matcher, "toHaveFocus")
            ];
          }
        });
      },
      [variantsOfDoc
        .map(
          variant =>
            `MemberExpression${variant}[property.name='activeElement'][parent.callee.name='expect'][parent.parent.property.name=/to(Be|(Strict)?Equal)$/]`
        )
        .join(", ")](node) {
        const element = node.parent.parent.parent.arguments[0];
        const matcher = node.parent.parent.property;
        context.report({
          node: node.parent,
          message: `Use toHaveFocus instead of checking activeElement`,
          fix(fixer) {
            if (!element.name) {
              return [
                fixer.removeRange([node.range[0], element.range[0]]),
                fixer.insertTextAfterRange(
                  [element.range[1], element.range[1] + 1],
                  ".toHaveFocus()"
                )
              ];
            }
            return [
              fixer.replaceText(node, element.name),
              fixer.remove(element),
              fixer.replaceText(matcher, "toHaveFocus")
            ];
          }
        });
      },
      [variantsOfDoc
        .map(
          variant =>
            `MemberExpression${variant}[property.name='activeElement'][parent.callee.object.callee.name='expect'][parent.callee.property.name=/to(Be|(Strict)?Equal)$/]`
        )
        .join(", ")](node) {
        const matcher = node.parent.callee.property;
        context.report({
          node: node.parent,
          message: `Use toHaveFocus instead of checking activeElement`,
          fix(fixer) {
            return [
              fixer.remove(node),
              fixer.replaceText(matcher, "toHaveFocus")
            ];
          }
        });
      }
    };
  }
};
