/**
 * @fileoverview prefer toHaveAttribute over checking  getAttribute/hasAttribute
 * @author Ben Monro
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        'prefer toHaveAttribute over checking  getAttribute/hasAttribute ',
      recommended: true,
    },
    fixable: 'code',
  },

  create: function(context) {
    return {
      [`CallExpression[callee.property.name='getAttribute'][parent.callee.name='expect'][parent.parent.property.name=/toBeNull/]`](
        node
      ) {
        context.report({
          node: node.parent,
          message: `Use toHaveAttribute instead of asserting on getAttribute`,
          fix(fixer) {
            return [
              fixer.removeRange([node.callee.object.end, node.end]),
              fixer.replaceTextRange(
                [
                  node.parent.parent.property.start,
                  node.parent.parent.parent.end,
                ],
                `not.toHaveAttribute(${node.arguments[0].raw})`
              ),
            ];
          },
        });
      },
      [`CallExpression[callee.property.name='getAttribute'][parent.callee.name='expect'][parent.parent.property.name=/toContain$|toMatch$/]`](
        node
      ) {
        context.report({
          node: node.parent,
          message: `Use toHaveAttribute instead of asserting on getAttribute`,
          fix(fixer) {
            return [
              fixer.removeRange([node.callee.object.end, node.end]),
              fixer.replaceText(node.parent.parent.property, 'toHaveAttribute'),
              fixer.replaceText(
                node.parent.parent.parent.arguments[0],
                `${
                  node.arguments[0].raw
                }, expect.string${node.parent.parent.property.name.slice(
                  2
                )}ing(${node.parent.parent.parent.arguments[0].raw})`
              ),
            ];
          },
        });
      },
      [`CallExpression[callee.property.name='getAttribute'][parent.callee.name='expect'][parent.parent.property.name=/toBe$|to(Strict)?Equal/]`](
        node
      ) {
        const arg = node.parent.parent.parent.arguments;
        const isNullOrEmpty =
          arg.length > 0 && (arg[0].value === null || arg[0].value === '');

        context.report({
          node: node.parent,
          message: `Use toHaveAttribute instead of asserting on getAttribute`,
          fix(fixer) {
            let lastFixer;
            if (isNullOrEmpty) {
              lastFixer = fixer.replaceText(
                node.parent.parent.parent.arguments[0],
                node.arguments[0].raw
              );
            } else {
              lastFixer = fixer.insertTextBefore(
                node.parent.parent.parent.arguments[0],
                `${node.arguments[0].raw}, `
              );
            }
            return [
              fixer.removeRange([node.callee.object.end, node.end]),
              fixer.replaceText(
                node.parent.parent.property,
                `${isNullOrEmpty ? 'not.' : ''}toHaveAttribute`
              ),
              lastFixer,
            ];
          },
        });
      },
      [`CallExpression[callee.property.name='hasAttribute'][parent.callee.name='expect'][parent.parent.property.name=/toBeNull|toBeUndefined|toBeDefined/]`](
        node
      ) {
        context.report({
          node: node.parent.parent.property,
          message: 'Invalid matcher for hasAttribute',
        });
      },
      [`CallExpression[callee.property.name='getAttribute'][parent.callee.name='expect'][parent.parent.property.name=/toBeUndefined|toBeDefined/]`](
        node
      ) {
        context.report({
          node: node.parent.parent.property,
          message: 'Invalid matcher for getAttribute',
        });
      },
      [`CallExpression[callee.property.name='hasAttribute'][parent.callee.name='expect'][parent.parent.property.name=/toBe$|to(Striclty)?Equal/]`](
        node
      ) {
        if (typeof node.parent.parent.parent.arguments[0].value === 'boolean') {
          context.report({
            node: node.parent,
            message: `Use toHaveAttribute instead of asserting on hasAttribute`,
            fix(fixer) {
              return [
                fixer.removeRange([node.callee.object.end, node.end]),
                fixer.replaceText(
                  node.parent.parent.property,
                  `${
                    node.parent.parent.parent.arguments[0].value === false
                      ? 'not.'
                      : ''
                  }toHaveAttribute`
                ),
                fixer.replaceText(
                  node.parent.parent.parent.arguments[0],
                  node.arguments[0].raw
                ),
              ];
            },
          });
        } else {
          context.report({
            node: node.parent.parent.property,
            message: 'Invalid matcher for hasAttribute',
          });
        }
      },
      [`CallExpression[callee.property.name='hasAttribute'][parent.callee.name='expect'][parent.parent.property.name=/toBeTruthy|toBeFalsy/]`](
        node
      ) {
        context.report({
          node: node.parent,
          message: `Use toHaveAttribute instead of asserting on hasAttribute`,
          fix(fixer) {
            return [
              fixer.removeRange([node.callee.object.end, node.end]),
              fixer.replaceTextRange(
                [
                  node.parent.parent.property.start,
                  node.parent.parent.parent.end,
                ],
                `${
                  node.parent.parent.property.name === 'toBeFalsy' ? 'not.' : ''
                }toHaveAttribute(${node.arguments[0].raw})`
              ),
            ];
          },
        });
      },
    };
  },
};
