# prefer toHaveClass over checking element.class (prefer-to-have-class)

This rule is an autofixable rule that reports usages of checking element className or classList in expect statements in preference of using the jest-dom
`toHaveClass` matcher.

## Rule Details

Examples of **incorrect** code for this rule:

```js
expect(el.className).toBe("bar");
expect(el.className).not.toBe("bar");
expect(el.className).toHaveProperty("class", "foo");
expect(screen.getByTestId("foo").className).toBe("foo");
expect(el.className).toContain("bar");
expect(el.className).not.toContain("baz");
expect(el).toHaveAttribute("class", "qux");

expect(el.classList[0]).toBe("foo");
expect(el.classList[0]).toBe("bar");
```

Examples of **correct** code for this rule:

```js
expect(el).toHaveClass("bar");
expect(el).toHaveStyle({ foo: "bar" });
expect(el.class).toMatchSnapshot();
expect(el.class).toEqual(foo);
```

## When Not To Use It

If you don't care about using built in matchers for checking class on dom
elements.

## Further Reading

- [jest-dom toHaveStyle](https://github.com/testing-library/jest-dom#tohaveclass)
- [ElementCSSInlineStyle.class](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/class)
