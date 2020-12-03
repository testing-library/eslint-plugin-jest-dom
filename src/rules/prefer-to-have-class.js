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
  [`CallExpression[callee.object.callee.name=expect][callee.object.arguments.0.property.name=className][callee.property.name=/toBe$|to(Strict)?Equal|toContain/][arguments.0.type=/Literal$/]`](
    node
  ) {
    const className = node.callee.object.arguments[0].property;
    const [classValue] = node.arguments;
    const matcher = node.callee.property;
    const classNameProp = node.callee.object.arguments[0].object;

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.removeRange([classNameProp.range[1], className.range[1]]),
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classValue,
            `${context.getSourceCode().getText(classValue)}${
              matcher.name === "toContain" ? "" : ", { exact: true }"
            }`
          ),
        ];
      },
    });
  },

  //expect(el.className).toEqual(expect.stringContaining("foo")) / toStrictEqual
  [`CallExpression[callee.object.callee.name=expect][callee.object.arguments.0.property.name=className][callee.property.name=/to(Strict)?Equal/][arguments.0.callee.object.name=expect][arguments.0.callee.property.name=stringContaining]`](
    node
  ) {
    const className = node.callee.object.arguments[0].property;
    const [classValue] = node.arguments[0].arguments;
    const matcher = node.callee.property;
    const classNameProp = node.callee.object.arguments[0].object;

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.removeRange([classNameProp.range[1], className.range[1]]),
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            node.arguments[0],
            `${context.getSourceCode().getText(classValue)}`
          ),
        ];
      },
    });
  },

  //expect(screen.getByRole("button").className).not.toBe("foo"); / toStrict?Equal / toContain
  [`CallExpression[callee.object.object.callee.name=expect][callee.object.object.arguments.0.property.name=className][callee.object.property.name=not][callee.property.name=/toBe$|to(Strict)?Equal|toContain/][arguments.0.type=/Literal$/]`](
    node
  ) {
    //[callee.object.arguments.0.property.name=className][callee.property.name=/toBe$|to(Strict)?Equal|toContain/][arguments.0.type=/Literal$/]
    const className = node.callee.object.object.arguments[0].property;
    const [classValue] = node.arguments;
    const matcher = node.callee.property;
    const classNameProp = node.callee.object.object.arguments[0].object;

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.removeRange([classNameProp.range[1], className.range[1]]),
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classValue,
            `${context.getSourceCode().getText(classValue)}${
              matcher.name === "toContain" ? "" : ", { exact: true }"
            }`
          ),
        ];
      },
    });
  },

  //expect(el).toHaveProperty("className", "foo: bar");
  //expect(el).toHaveAttribute("class", "foo: bar");
  [[
    `CallExpression[callee.object.callee.name=expect][callee.property.name=toHaveAttribute][arguments.0.type=/Literal/][arguments.1.type=/Literal$/]`,
    `CallExpression[callee.object.callee.name=expect][callee.property.name=toHaveProperty][arguments.0.type=/Literal/][arguments.1.type=/Literal$/]`,
  ].join(",")](node) {
    const matcher = node.callee.property;
    const [classArg, classValueArg] = node.arguments;

    const classNameValue = context
      .getSourceCode()
      .getText(classArg)
      .slice(1, -1);
    if (
      (matcher.name === "toHaveAttribute" && classNameValue !== "class") ||
      (matcher.name === "toHaveProperty" && classNameValue !== "className")
    )
      return;

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classArg,
            context.getSourceCode().getText(classValueArg)
          ),
          fixer.replaceText(classValueArg, `{ exact: true }`),
        ];
      },
    });
  },

  //expect(el).not.toHaveAttribute("class", "foo: bar");
  //expect(el).not.toHaveProperty("className", "foo: bar");
  [[
    `CallExpression[callee.object.object.callee.name=expect][callee.object.property.name=not][callee.property.name=toHaveAttribute][arguments.0.type=/Literal/][arguments.1.type=/Literal$/]`,
    `CallExpression[callee.object.object.callee.name=expect][callee.object.property.name=not][callee.property.name=toHaveProperty][arguments.0.type=/Literal/][arguments.1.type=/Literal$/]`,
  ].join(",")](node) {
    //[callee.object.property.name=/toHaveAttribute|toHaveProperty/][arguments.0.value=class][arguments.1.type=/Literal$/]
    const matcher = node.callee.property;
    const [classArg, classValueArg] = node.arguments;
    const classNameValue = context
      .getSourceCode()
      .getText(classArg)
      .slice(1, -1);
    if (
      (matcher.name === "toHaveAttribute" && classNameValue !== "class") ||
      (matcher.name === "toHaveProperty" && classNameValue !== "className")
    )
      return;

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classArg,
            context.getSourceCode().getText(classValueArg)
          ),
          fixer.replaceText(classValueArg, `{ exact: true }`),
        ];
      },
    });
  },

  //expect(el).toHaveProperty(`className`, expect.containing("foo"));
  //expect(el).toHaveAttribute(`class`, expect.containing("foo"));
  [[
    `CallExpression[callee.object.callee.name=expect][callee.property.name=toHaveAttribute][arguments.0.type=/Literal/][arguments.1.callee.object.name=expect][arguments.1.callee.property.name=stringContaining]`,
    `CallExpression[callee.object.callee.name=expect][callee.property.name=toHaveProperty][arguments.0.type=/Literal/][arguments.1.callee.object.name=expect][arguments.1.callee.property.name=stringContaining]`,
  ].join(",")](node) {
    const matcher = node.callee.property;
    const [classArg, classValue] = node.arguments;
    const classValueArg = classValue.arguments[0];

    const classNameValue = context
      .getSourceCode()
      .getText(classArg)
      .slice(1, -1);
    if (
      (matcher.name === "toHaveAttribute" && classNameValue !== "class") ||
      (matcher.name === "toHaveProperty" && classNameValue !== "className")
    )
      return;
    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classArg,
            context.getSourceCode().getText(classValueArg)
          ),
          fixer.removeRange([classArg.range[1], classValue.range[1]]),
        ];
      },
    });
  },
});
