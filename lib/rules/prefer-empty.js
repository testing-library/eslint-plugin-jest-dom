/**
 * @fileoverview Prefer toBeEmpty over checking innerHTML
 * @author Ben Monro
 */

module.exports = {
  meta: {
    docs: {
      description: 'Prefer toBeEmpty over checking innerHTML',
      category: 'jest-dom',
      recommended: true,
    },
    fixable: 'code', // or "code" or "whitespace"
  },

  create: function(context) {
    return {
      [`MemberExpression[property.name = 'innerHTML'][parent.callee.name = 'expect'][parent.parent.property.name = /toBe$|to(Strict)?Equal/]`](
        node
      ) {
        if (!node.parent.parent.parent.arguments[0].value) {
          context.report({
            node,
            message: 'Use toBeEmpty instead of checking inner html.',
            fix(fixer) {
              return [
                fixer.removeRange([node.property.start - 1, node.property.end]),
                fixer.replaceText(node.parent.parent.property, 'toBeEmpty'),
                fixer.remove(node.parent.parent.parent.arguments[0]),
              ];
            },
          });
        }
      },
      [`MemberExpression[property.name='innerHTML'][parent.parent.property.name='not'][parent.parent.parent.property.name=/toBe$|to(Strict)?Equal$/][parent.parent.object.callee.name='expect']`](
        node
      ) {
        if (!node.parent.parent.parent.parent.arguments[0].value) {
          context.report({
            node,
            message: 'Use toBeEmpty instead of checking inner html.',
            fix(fixer) {
              return [
                fixer.removeRange([node.property.start - 1, node.property.end]),
                fixer.replaceText(
                  node.parent.parent.parent.property,
                  'toBeEmpty'
                ),
                fixer.remove(node.parent.parent.parent.parent.arguments[0]),
              ];
            },
          });
        }
      },
      [`MemberExpression[property.name = 'firstChild'][parent.callee.name = 'expect'][parent.parent.property.name = /toBeNull$/]`](
        node
      ) {
        context.report({
          node,
          message: 'Use toBeEmpty instead of checking inner html.',
          fix(fixer) {
            return [
              fixer.removeRange([node.property.start - 1, node.property.end]),
              fixer.replaceText(node.parent.parent.property, 'toBeEmpty'),
            ];
          },
        });
      },

      [`MemberExpression[property.name='firstChild'][parent.parent.property.name='not'][parent.parent.parent.property.name=/toBe$|to(Strict)?Equal$/][parent.parent.object.callee.name='expect']`](
        node
      ) {
        if (node.parent.parent.parent.parent.arguments[0].value === null) {
          context.report({
            node,
            message: 'Use toBeEmpty instead of checking inner html.',
            fix(fixer) {
              return [
                fixer.removeRange([node.property.start - 1, node.property.end]),
                fixer.replaceText(
                  node.parent.parent.parent.property,
                  'toBeEmpty'
                ),
                fixer.remove(node.parent.parent.parent.parent.arguments[0]),
              ];
            },
          });
        }
      },

      [`MemberExpression[property.name='firstChild'][parent.parent.property.name='not'][parent.parent.parent.property.name=/toBeNull$/][parent.parent.object.callee.name='expect']`](
        node
      ) {
        context.report({
          node,
          message: 'Use toBeEmpty instead of checking inner html.',
          fix(fixer) {
            return [
              fixer.removeRange([node.property.start - 1, node.property.end]),
              fixer.replaceText(
                node.parent.parent.parent.property,
                'toBeEmpty'
              ),
            ];
          },
        });
      },
      [`MemberExpression[property.name = 'firstChild'][parent.callee.name = 'expect'][parent.parent.property.name = /toBe$|to(Strict)?Equal/]`](
        node
      ) {
        if (node.parent.parent.parent.arguments[0].value === null) {
          context.report({
            node,
            message: 'Use toBeEmpty instead of checking inner html.',
            fix(fixer) {
              return [
                fixer.removeRange([node.property.start - 1, node.property.end]),
                fixer.replaceText(node.parent.parent.property, 'toBeEmpty'),
                fixer.remove(node.parent.parent.parent.arguments[0]),
              ];
            },
          });
        }
      },
    };
  },
};
