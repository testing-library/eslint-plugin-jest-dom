# Prefer toHaveValue over checking element.value (`jest-dom/prefer-to-have-value`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule is an autofixable rule that encourages the use of toHaveValue over checking the value attribute.

## Rule Details

This rule checks for usages of `.value` or `.toHaveAttribute("value")`.
The only valid use case is when using greater/less than
matchers since there isn't any equivalent use with `toHaveValue`

Examples of **incorrect** code for this rule:

```js
expect(element).toHaveAttribute("value", "foo");
expect(element).toHaveProperty("value", "foo");
expect(element.value).toBe("foo");
expect(element.value).not.toEqual("foo");
expect(element.value).not.toStrictEqual("foo");
```

Examples of **correct** code for this rule:

```js
expect(element).toHaveValue("foo");
expect(element.value).toBeGreaterThan(2);
expect(element.value).toBeLessThan(2);
```

## When Not To Use It

If you don't care about using built in matchers for checking attributes on dom
elements.

## Further Reading

- [jest-dom toHaveAttribute](https://github.com/testing-library/jest-dom#tohaveattribute)
- [getAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute)
- [hasAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute)
