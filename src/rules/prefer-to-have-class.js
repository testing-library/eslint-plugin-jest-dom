/**
 * @fileoverview prefer toHaveClass over checking element className
 * @author Ben Monro
 */

import { getQueryNodeFrom } from "../assignment-ast";
import { getSourceCode } from "../context";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const messageId = "use-to-have-class";

/**
 * `classList[x]` is a class name only when `x` is an index. Keys like
 * `classList["length"]` or `classList["value"]` read other properties.
 */
const isClassListIndex = ({ property }) => {
  let key;
  if (property.type === "Literal") {
    key = property.value;
  } else if (
    property.type === "TemplateLiteral" &&
    property.expressions.length === 0
  ) {
    key = property.quasis[0].value.cooked;
  } else {
    return true;
  }
  return (
    typeof key === "number" ||
    (typeof key === "string" && /^(0|[1-9]\d*)$/.test(key))
  );
};

// `expect.stringContaining(...)`, `expect.not.stringMatching(...)`, `expect.any(...)`, etc.
const isAsymmetricMatcher = (node) => {
  if (node.type !== "CallExpression") {
    return false;
  }
  let callee = node.callee;
  while (callee.type === "MemberExpression") {
    callee = callee.object;
  }
  return callee.type === "Identifier" && callee.name === "expect";
};

export const meta = {
  docs: {
    category: "Best Practices",
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
  //expect(el.classList.contains("foo")).toBe(true)
  [`CallExpression[callee.object.callee.name=expect][callee.object.arguments.0.callee.object.property.name=classList][callee.object.arguments.0.callee.property.name=contains][callee.property.name=/toBe(Tru(e|thy)|Fals(e|y))?|to(Strict)?Equal/]`](
    node,
  ) {
    const classValue = node.callee.object.arguments[0].arguments[0];
    const checkedProp = node.callee.object.arguments[0].callee.object.object;
    const matcher = node.callee.property;
    const [matcherArg] = node.arguments;
    const [expectArg] = node.callee.object.arguments;
    const isTruthy =
      (matcher.name === "toBe" && matcherArg.value === true) ||
      matcher.name === "toBeTruthy" ||
      matcher.name === "toBeTrue";

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.removeRange([checkedProp.range[1], expectArg.range[1]]),

          fixer.replaceText(matcher, `${isTruthy ? "" : "not."}toHaveClass`),
          matcherArg
            ? fixer.replaceText(
                matcherArg,
                getSourceCode(context).getText(classValue),
              )
            : fixer.insertTextBefore(
                getSourceCode(context).getTokenAfter(matcher, { skip: 1 }),
                getSourceCode(context).getText(classValue),
              ),
        ];
      },
    });
  },

  //expect(el.classList[0]).toBe("bar")
  [`CallExpression[callee.object.callee.name=expect][callee.object.arguments.0.object.property.name=classList][callee.object.arguments.0.computed=true][callee.property.name=/toBe$|to(Strict)?Equal|toContain/][arguments.0.type=/Literal$/]`](
    node,
  ) {
    const [classValue] = node.arguments;
    const matcher = node.callee.property;
    const classNameProp = node.callee.object.arguments[0].object;
    const expectArg = node.callee.object.arguments[0];

    if (!isClassListIndex(expectArg)) {
      return;
    }

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        //can't autofix here as it toHaveClass doesn't have a partial matcher / regex for class names.
        if (matcher.name === "toContain") {
          return;
        }
        return [
          fixer.removeRange([
            classNameProp.object.range[1],
            expectArg.range[1],
          ]),
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classValue,
            getSourceCode(context).getText(classValue),
          ),
        ];
      },
    });
  },

  //expect(el.classList[0]).not.toBe("bar")
  [`CallExpression[callee.object.object.callee.name=expect][callee.object.object.arguments.0.object.property.name=classList][callee.object.object.arguments.0.computed=true][callee.object.property.name=not][callee.property.name=/toBe$|to(Strict)?Equal|toContain/][arguments.0.type=/Literal$/]`](
    node,
  ) {
    if (!isClassListIndex(node.callee.object.object.arguments[0])) {
      return;
    }
    //can't autofix this case because the class could be in another element of the classList array.
    context.report({
      node,
      messageId,
    });
  },
  //expect(el.classList.value).toBe("foo bar") / toStrict?Equal / toContain
  //expect(el.classList.value).not.toBe("foo bar") / toStrict?Equal / toContain
  [[
    `CallExpression[callee.object.callee.name=expect][callee.object.arguments.0.computed=false][callee.object.arguments.0.property.name=value][callee.object.arguments.0.object.computed=false][callee.object.arguments.0.object.property.name=classList][callee.property.name=/^(toBe|to(Strict)?Equal|toContain)$/]`,
    `CallExpression[callee.object.object.callee.name=expect][callee.object.object.arguments.0.computed=false][callee.object.object.arguments.0.property.name=value][callee.object.object.arguments.0.object.computed=false][callee.object.object.arguments.0.object.property.name=classList][callee.object.property.name=not][callee.property.name=/^(toBe|to(Strict)?Equal|toContain)$/]`,
  ].join(",")](node) {
    const matcher = node.callee.property;
    const expectCall =
      node.callee.object.type === "CallExpression"
        ? node.callee.object
        : node.callee.object.object;
    const [classListValue] = expectCall.arguments;
    const element = classListValue.object.object;
    const [expected] = node.arguments;

    // `toContain` checks for a substring of the class attribute, which
    // `.toHaveClass()` can't express
    // an asymmetric matcher such as `expect.stringContaining("foo")` can't be
    // passed to `.toHaveClass()`
    if (
      matcher.name === "toContain" ||
      node.arguments.length !== 1 ||
      isAsymmetricMatcher(expected)
    ) {
      context.report({ node: matcher, messageId });
      return;
    }

    // `.toHaveClass()` splits each string on whitespace, so the expected
    // value can be passed through as is
    context.report({
      node: matcher,
      messageId,
      fix: (fixer) => [
        fixer.removeRange([element.range[1], classListValue.range[1]]),
        fixer.replaceText(matcher, "toHaveClass"),
        fixer.insertTextAfter(expected, ", { exact: true }"),
      ],
    });
  },

  //expect(el.className | el.classList).toBe("bar") / toStrict?Equal / toContain
  [`CallExpression[callee.object.callee.name=expect][callee.object.arguments.0.property.name=/class(Name|List)/][callee.property.name=/toBe$|to(Strict)?Equal|toContain/]`](
    node,
  ) {
    const checkedProp = node.callee.object.arguments[0].property;
    const [classValue] = node.arguments;
    const matcher = node.callee.property;
    const classNameProp = node.callee.object.arguments[0].object;

    const { isDTLQuery } = getQueryNodeFrom(context, classNameProp);
    if (!isDTLQuery) {
      return;
    }
    // don't report here if using `expect.foo()`

    if (
      classValue.type === "CallExpression" &&
      classValue.callee.type === "MemberExpression" &&
      classValue.callee.object.name === "expect"
    ) {
      return;
    }

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        if (checkedProp.name === "classList" && matcher.name !== "toContain") {
          return;
        }

        return [
          fixer.removeRange([classNameProp.range[1], checkedProp.range[1]]),
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classValue,
            `${getSourceCode(context).getText(classValue)}${
              matcher.name === "toContain" ? "" : ", { exact: true }"
            }`,
          ),
        ];
      },
    });
  },

  //expect(el.className | el.classList).toEqual(expect.stringContaining("foo") | objectContaining) / toStrictEqual
  [`CallExpression[callee.object.callee.name=expect][callee.object.arguments.0.property.name=/class(Name|List)/][callee.property.name=/to(Strict)?Equal/][arguments.0.callee.object.name=expect]`](
    node,
  ) {
    const className = node.callee.object.arguments[0].property;
    const [classValue] = node.arguments[0].arguments;
    const matcher = node.callee.property;
    const classNameProp = node.callee.object.arguments[0].object;
    const matcherArg = node.arguments[0].callee.property;
    const { isDTLQuery } = getQueryNodeFrom(context, classNameProp);
    if (!isDTLQuery) {
      return;
    }

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        if (matcherArg.name !== "stringContaining") {
          return;
        }
        return [
          fixer.removeRange([classNameProp.range[1], className.range[1]]),
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            node.arguments[0],
            `${getSourceCode(context).getText(classValue)}`,
          ),
        ];
      },
    });
  },

  //expect(screen.getByRole("button").className | classList).not.toBe("foo"); / toStrict?Equal / toContain
  [`CallExpression[callee.object.object.callee.name=expect][callee.object.object.arguments.0.property.name=/class(Name|List)/][callee.object.property.name=not][callee.property.name=/toBe$|to(Strict)?Equal|toContain/]`](
    node,
  ) {
    const className = node.callee.object.object.arguments[0].property;
    const [classValue] = node.arguments;
    const matcher = node.callee.property;
    const classNameProp = node.callee.object.object.arguments[0].object;

    const { isDTLQuery } = getQueryNodeFrom(context, classNameProp);
    if (!isDTLQuery) {
      return;
    }
    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        if (className.name === "classList" && matcher.name !== "toContain") {
          return;
        }

        return [
          fixer.removeRange([classNameProp.range[1], className.range[1]]),
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classValue,
            `${getSourceCode(context).getText(classValue)}${
              matcher.name === "toContain" ? "" : ", { exact: true }"
            }`,
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

    const classNameValue = getSourceCode(context)
      .getText(classArg)
      .slice(1, -1);
    if (
      (matcher.name === "toHaveAttribute" && classNameValue !== "class") ||
      (matcher.name === "toHaveProperty" && classNameValue !== "className")
    ) {
      return;
    }

    const { isDTLQuery } = getQueryNodeFrom(
      context,
      node.callee.object.arguments[0],
    );
    if (!isDTLQuery) {
      return;
    }
    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classArg,
            getSourceCode(context).getText(classValueArg),
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
    const classNameValue = getSourceCode(context)
      .getText(classArg)
      .slice(1, -1);
    if (
      (matcher.name === "toHaveAttribute" && classNameValue !== "class") ||
      (matcher.name === "toHaveProperty" && classNameValue !== "className")
    ) {
      return;
    }

    const { isDTLQuery } = getQueryNodeFrom(
      context,
      node.callee.object.object.arguments[0],
    );
    if (!isDTLQuery) {
      return;
    }
    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classArg,
            getSourceCode(context).getText(classValueArg),
          ),
          fixer.replaceText(classValueArg, `{ exact: true }`),
        ];
      },
    });
  },

  //expect(el).toHaveProperty(`className`, expect.stringContaining("foo"));
  //expect(el).toHaveAttribute(`class`, expect.stringContaining("foo"));
  [[
    `CallExpression[callee.object.callee.name=expect][callee.property.name=toHaveAttribute][arguments.0.type=/Literal/][arguments.1.callee.object.name=expect][arguments.1.callee.property.name=stringContaining]`,
    `CallExpression[callee.object.callee.name=expect][callee.property.name=toHaveProperty][arguments.0.type=/Literal/][arguments.1.callee.object.name=expect][arguments.1.callee.property.name=stringContaining]`,
  ].join(",")](node) {
    const matcher = node.callee.property;
    const [classArg, classValue] = node.arguments;
    const classValueArg = classValue.arguments[0];

    const classNameValue = getSourceCode(context)
      .getText(classArg)
      .slice(1, -1);
    if (
      (matcher.name === "toHaveAttribute" && classNameValue !== "class") ||
      (matcher.name === "toHaveProperty" && classNameValue !== "className")
    ) {
      return;
    }

    const { isDTLQuery } = getQueryNodeFrom(
      context,
      node.callee.object.arguments[0],
    );
    if (!isDTLQuery) {
      return;
    }

    context.report({
      node: matcher,
      messageId,
      fix(fixer) {
        return [
          fixer.replaceText(matcher, "toHaveClass"),
          fixer.replaceText(
            classArg,
            getSourceCode(context).getText(classValueArg),
          ),
          fixer.removeRange([classArg.range[1], classValue.range[1]]),
        ];
      },
    });
  },
});
