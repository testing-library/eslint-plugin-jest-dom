/**
 * @fileoverview prefer toHaveAttribute over checking  getAttribute/hasAttribute
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const meta = {
  docs: {
    category: "Best Practices",
    description: "prefer toHaveValue over checking element.value",
    url: "prefer-to-have-value",
    recommended: true,
  },
  fixable: "code",
  messages: {
    "use-to-have-value": `Prefer .toHaveValue() over other attribute checks`,
  },
};
const messageId = "use-to-have-value";

export const create = (context) => ({
  // expect(element.value).toBe('foo') / toEqual / toStrictEqual
  [`CallExpression[callee.property.name=/to(Be|(Strict)?Equal)$/][callee.object.arguments.0.property.name=value][callee.object.callee.name=expect]`](
    node
  ) {
    context.report({
      messageId,
      node,
      fix(fixer) {
        return [
          fixer.removeRange([
            node.callee.object.arguments[0].object.range[1],
            node.callee.object.arguments[0].property.range[1],
          ]),
          fixer.replaceText(node.callee.property, "toHaveValue"),
        ];
      },
    });
  },

  // expect(element.value).not.toBe('foo') / toEqual / toStrictEqual
  [`CallExpression[callee.property.name=/to(Be|(Strict)?Equal)$/][callee.object.object.callee.name=expect][callee.object.property.name=not][callee.object.object.arguments.0.property.name=value]`](
    node
  ) {
    context.report({
      messageId,
      node,
      fix(fixer) {
        return [
          fixer.removeRange([
            node.callee.object.object.arguments[0].object.range[1],
            node.callee.object.object.arguments[0].property.range[1],
          ]),
          fixer.replaceText(node.callee.property, "toHaveValue"),
        ];
      },
    });
  },

  //expect(element).toHaveAttribute('value', 'foo')  / Property
  [`CallExpression[callee.property.name=/toHave(Attribute|Property)/][arguments.0.value=value][arguments.1][callee.object.callee.name=expect], CallExpression[callee.property.name=/toHave(Attribute|Property)/][arguments.0.value=value][arguments.1][callee.object.object.callee.name=expect][callee.object.property.name=not]`](
    node
  ) {
    context.report({
      messageId,
      node,

      fix(fixer) {
        return [
          fixer.replaceText(node.callee.property, "toHaveValue"),
          fixer.removeRange([
            node.arguments[0].range[0],
            node.arguments[1].range[0],
          ]),
        ];
      },
    });
  },
});
