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
            recommended: false,
        },
        fixable: 'code',
    },

    create: function (context) {
        return {
            [`CallExpression[callee.property.name='getAttribute'][parent.callee.name='expect'][parent.parent.property.name=/toBe$|toEqual/]`](
                node
            ) {
                context.report({
                    node: node.parent,
                    message: `Use toHaveAttribute instead of asserting on getAttribute`,
                    fix(fixer) {
                        return [
                            fixer.removeRange([node.callee.object.end, node.end]),
                            fixer.replaceText(node.parent.parent.property, 'toHaveAttribute'),
                            fixer.insertTextBefore(
                                node.parent.parent.parent.arguments[0],
                                `${node.arguments[0].raw}, `
                            ),
                        ];
                    },
                });
            },
            [`CallExpression[callee.property.name='hasAttribute'][parent.callee.name='expect'][parent.parent.property.name=/toBe$|toEqual/]`](
                node
            ) {
                context.report({
                    node: node.parent,
                    message: `Use toHaveAttribute instead of asserting on hasAttribute`,
                    fix(fixer) {
                        return [
                            fixer.removeRange([node.callee.object.end, node.end]),
                            fixer.replaceText(node.parent.parent.property, `${node.parent.parent.parent.arguments[0].value === false ? 'not.' : ''}toHaveAttribute`),
                            fixer.replaceText(
                                node.parent.parent.parent.arguments[0],
                                node.arguments[0].raw
                            ),
                        ];
                    },
                });
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
                                `toHaveAttribute(${node.arguments[0].raw})`
                            ),
                        ];
                    },
                });
            },
        };
    },
};
