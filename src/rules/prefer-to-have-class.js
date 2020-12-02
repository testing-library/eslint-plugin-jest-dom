/**
 * @fileoverview prefer toHaveClass over checking element className
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const messageId = "use-to-have-class";
export const meta = {
  docs: {
    category: "Best Practice",
    url: "prefer-to-have-class",
    description: "prefer toHaveClass over checking element className",
    recommended: true,
  },
  messages: {
    [messageId]: `Prefer .toHaveClass() over checking element className`,
  },
  fixable: "code",
};

export const create = (context) => ({
  //expect(el.className).toBe("bar") / toStrict?Equal / toContain
  [`MemberExpression[object.callee.name=expect][object.arguments.0.property.name=className][property.name=/toBe$|to(Strict)?Equal|toContain/][parent.arguments.0.type=/Literal$/]`](
    node
  ) {
    const className = node.object.arguments[0].property;
    const [classValue] = node.parent.arguments;
    const matcher = node.property;
    context.report({
      node: node.property,
      messageId,
      fix(fixer) {
        return [
          fixer.removeRange([node.object.arguments[0].object.range[1], className.range[1]]),
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classValue,
            classValue.raw
          ),
        ];
      },
    });
  },
  //expect(screen.getByRole("button").className).not.toBe("foo"); / toStrict?Equal / toContain
  [`MemberExpression[property.name=className][computed=false][parent.parent.property.name=not][parent.parent.parent.property.name=/toBe$|to(Strict)?Equal|toContain/][parent.callee.name=expect]`](
    node
  ) {
    const className = node.property;
    const classValue = node.parent.parent.parent.parent.arguments[0];
    const matcher = node.parent.parent.parent.property;

    context.report({
      node: node.property,
      messageId,
      fix(fixer) {
        return [
          fixer.removeRange([node.object.range[1], className.range[1]]),
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classValue,
            classValue.raw
          ),
        ];
      },
    });
  },

  //expect(el).toHaveAttribute("class", "foo: bar");
  [`CallExpression[callee.property.name=/toHaveAttribute|toHaveProperty/][arguments.0.value=class][arguments.1]`](
    node
  ) {
    context.report({
      node: node.arguments[0],
      messageId,
      fix(fixer) {
        return [
          fixer.replaceText(node.callee.property, "toHaveClass"),
          fixer.removeRange([
            node.arguments[0].range[0],
            node.arguments[1].range[0],
          ]),
        ];
      },
    });
  },

});
