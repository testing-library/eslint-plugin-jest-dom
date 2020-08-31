/**
 * @fileoverview prefer toHaveStyle over checking element style
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const camelCase = (str) => str.replace(/-([a-z])/g, (c) => c[1].toUpperCase());
export const meta = {
  docs: {
    category: "jest-dom",
    url: "prefer-to-have-style",
    description: "prefer toHaveStyle over checking element style",
    recommended: true,
  },
  fixable: "code",
};

export const create = (context) => ({
  //expect(el.style.foo).toBe("bar");
  [`MemberExpression[property.name=style][parent.computed=false][parent.parent.parent.property.name=/toBe$|to(Strict)?Equal/][parent.parent.callee.name=expect]`](
    node
  ) {
    const styleName = node.parent.property;
    const [styleValue] = node.parent.parent.parent.parent.arguments;
    const matcher = node.parent.parent.parent.property;
    context.report({
      node: node.property,
      message: "Use toHaveStyle instead of asserting on element style",
      fix(fixer) {
        return [
          fixer.removeRange([node.object.range[1], styleName.range[1]]),
          fixer.replaceText(matcher, "toHaveStyle"),
          fixer.replaceText(
            styleValue,
            `{${styleName.name}:${styleValue.raw}}`
          ),
        ];
      },
    });
  },
  //expect(el.style.foo).not.toBe("bar");
  [`MemberExpression[property.name=style][parent.computed=false][parent.parent.parent.property.name=not][parent.parent.parent.parent.property.name=/toBe$|to(Strict)?Equal/][parent.parent.callee.name=expect]`](
    node
  ) {
    const styleName = node.parent.property;
    const styleValue = node.parent.parent.parent.parent.parent.arguments[0];
    const matcher = node.parent.parent.parent.parent.property;

    context.report({
      node: node.property,
      message: "Use toHaveStyle instead of asserting on element style",
      fix(fixer) {
        return [
          fixer.removeRange([node.object.range[1], styleName.range[1]]),
          fixer.replaceText(matcher, "toHaveStyle"),
          fixer.replaceText(
            styleValue,
            `{${styleName.name}:${styleValue.raw}}`
          ),
        ];
      },
    });
  },
  // expect(el.style).toContain("foo-bar")
  [`MemberExpression[property.name=style][parent.parent.property.name=toContain][parent.callee.name=expect]`](
    node
  ) {
    const [styleName] = node.parent.parent.parent.arguments;
    const matcher = node.parent.parent.property;

    context.report({
      node: node.property,
      message: "Use toHaveStyle instead of asserting on element style",
      fix(fixer) {
        return [
          fixer.removeRange([node.object.range[1], node.property.range[1]]),
          fixer.replaceText(matcher, "toHaveStyle"),
          fixer.replaceText(
            styleName,
            `{${camelCase(styleName.value)}: expect.anything()}`
          ),
        ];
      },
    });
  },
  // expect(el.style).not.toContain("foo-bar")
  [`MemberExpression[property.name=style][parent.parent.property.name=not][parent.parent.parent.property.name=toContain]`](
    node
  ) {
    const [styleName] = node.parent.parent.parent.parent.arguments;
    const matcher = node.parent.parent.parent.property;

    context.report({
      node: node.property,
      message: "Use toHaveStyle instead of asserting on element style",
      fix(fixer) {
        return [
          fixer.removeRange([node.object.range[1], node.property.range[1]]),
          fixer.replaceText(matcher, "toHaveStyle"),
          fixer.replaceText(
            styleName,
            `{${camelCase(styleName.value)}: expect.anything()}`
          ),
        ];
      },
    });
  },

  //expect(el).toHaveAttribute("style", "foo: bar");
  [`CallExpression[callee.property.name][arguments.0.value=style][arguments.1]`](
    node
  ) {
    context.report({
      node: node.arguments[0],
      message: "Use toHaveStyle instead of asserting on element style",
      fix(fixer) {
        return [
          fixer.replaceText(node.callee.property, "toHaveStyle"),
          fixer.removeRange([
            node.arguments[0].range[0],
            node.arguments[1].range[0],
          ]),
        ];
      },
    });
  },

  //expect(el.style["foo-bar"]).toBe("baz")
  [`MemberExpression[property.name=style][parent.computed=true][parent.parent.parent.property.name=/toBe$|to(Strict)?Equal/][parent.parent.callee.name=expect]`](
    node
  ) {
    const styleName = node.parent.property;
    const [styleValue] = node.parent.parent.parent.parent.arguments;
    const matcher = node.parent.parent.parent.property;
    const startOfStyleMemberExpression = node.object.range[1];
    const endOfStyleMemberExpression = node.parent.parent.arguments[0].range[1];

    context.report({
      node: node.property,
      message: "Use toHaveStyle instead of asserting on element style",
      fix(fixer) {
        return [
          fixer.removeRange([
            startOfStyleMemberExpression,
            endOfStyleMemberExpression,
          ]),
          fixer.replaceText(matcher, "toHaveStyle"),
          fixer.replaceText(
            styleValue,
            `{${camelCase(styleName.value)}: ${styleValue.raw}}`
          ),
        ];
      },
    });
  },
  //expect(el.style["foo-bar"]).not.toBe("baz")
  [`MemberExpression[property.name=style][parent.computed=true][parent.parent.parent.property.name=not][parent.parent.parent.parent.parent.callee.property.name=/toBe$|to(Strict)?Equal/][parent.parent.callee.name=expect]`](
    node
  ) {
    const styleName = node.parent.property;
    const [styleValue] = node.parent.parent.parent.parent.parent.arguments;
    const matcher = node.parent.parent.parent.parent.property;
    const endOfStyleMemberExpression = node.parent.parent.arguments[0].range[1];

    context.report({
      node: node.property,
      message: "Use toHaveStyle instead of asserting on element style",
      fix(fixer) {
        return [
          fixer.removeRange([node.object.range[1], endOfStyleMemberExpression]),
          fixer.replaceText(matcher, "toHaveStyle"),
          fixer.replaceText(
            styleValue,
            `{${camelCase(styleName.value)}: ${styleValue.raw}}`
          ),
        ];
      },
    });
  },
  //expect(foo.style).toHaveProperty("foo", "bar")
  [`MemberExpression[property.name=style][parent.parent.property.name=toHaveProperty][parent.callee.name=expect]`](
    node
  ) {
    const [styleName, styleValue] = node.parent.parent.parent.arguments;
    const matcher = node.parent.parent.property;

    context.report({
      node: node.property,
      message: "Use toHaveStyle instead of asserting on element style",
      fix(fixer) {
        return [
          fixer.removeRange([node.object.range[1], node.property.range[1]]),
          fixer.replaceText(matcher, "toHaveStyle"),
          fixer.replaceTextRange(
            [styleName.range[0], styleValue.range[1]],
            `{${camelCase(styleName.value)}: ${styleValue.raw}}`
          ),
        ];
      },
    });
  },

  //expect(foo.style).not.toHaveProperty("foo", "bar")
  [`MemberExpression[property.name=style][parent.parent.property.name=not][parent.parent.parent.property.name=toHaveProperty][parent.callee.name=expect]`](
    node
  ) {
    const [styleName, styleValue] = node.parent.parent.parent.parent.arguments;
    const matcher = node.parent.parent.parent.property;

    context.report({
      node: node.property,
      message: "Use toHaveStyle instead of asserting on element style",
      fix(fixer) {
        return [
          fixer.removeRange([node.object.range[1], node.property.range[1]]),
          fixer.replaceText(matcher, "toHaveStyle"),
          fixer.replaceTextRange(
            [styleName.range[0], styleValue.range[1]],
            `{${camelCase(styleName.value)}: ${styleValue.raw}}`
          ),
        ];
      },
    });
  },
});
