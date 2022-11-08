# Prefer toHaveTextContent over checking element.textContent (`jest-dom/prefer-to-have-text-content`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Please describe the origin of the rule here.

## Rule Details

This rule aims to prevent checking of the `textContent` DOM node attribute in
tests and prefer `toHaveTextContent` instead.

Examples of **incorrect** code for this rule:

```js
expect(element.textContent).toBe("foo");
expect(container.firstChild.textContent).toBe("foo");
expect(getByText("foo").textContent).toBe("foo");
expect(screen.getByText("foo").textContent).toBe("foo");
expect(element.textContent).toEqual("foo");
expect(element.textContent).toContain("foo");
expect(element.textContent).not.toBe("foo");
expect(element.textContent).not.toContain("foo");
```

Examples of **correct** code for this rule:

```js
expect(string).toBe("foo");
expect(element).toHaveTextContent("foo");
expect(container.lastNode).toBe("foo");
```

## When Not To Use It

Don't use this rule if you don't care about the added readability and
improvements that `toHaveTextContent` offers to your expects.

## Further Reading

- [Docs on toHaveContent](https://github.com/testing-library/jest-dom#tohavetextcontent)
