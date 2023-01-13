# Prefer toHaveAttribute over checking  getAttribute/hasAttribute  (`jest-dom/prefer-to-have-attribute`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule is an autofixable rule that reports usages of `getAttribute` or
`hasAttribute` in expect statements in preference of using the jest-dom
`toHaveAttribute` matcher.

## Rule Details

This checks the various built in jest-dom matchers when used in conjunction with
get/hasAttribute. The only valid use case if when using greater/less than
matchers since there isn't any equivalent use with `toHaveAttribute()`

Examples of **incorrect** code for this rule:

```js
expect(element.getAttribute("foo")).toMatch(/bar/);
expect(element.getAttribute("foo")).toContain("bar");
expect(getByText("thing").getAttribute("foo")).toBe("bar");
expect(getByText("yes").getAttribute("data-blah")).toBe(
  expect.stringMatching(/foo/)
);
expect(element.hasAttribute("foo")).toBeTruthy();
```

Examples of **correct** code for this rule:

```js
expect(element.foo).toBeTruthy();
expect(element.getAttributeNode()).toBeNull();
expect(element.getAttribute("foo")).toBeGreaterThan(2);
expect(element.getAttribute("foo")).toBeLessThan(2);
```

## When Not To Use It

If you don't care about using built in matchers for checking attributes on dom
elements.

## Further Reading

- [jest-dom toHaveAttribute](https://github.com/testing-library/jest-dom#tohaveattribute)
- [getAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute)
- [hasAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute)
