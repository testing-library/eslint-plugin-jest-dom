# prefer toHaveStyle over checking element.style (prefer-to-have-style)

This rule is an autofixable rule that reports usages of checking element.style in expect statements in preference of using the jest-dom
`toHaveStyle` matcher.

## Rule Details

Examples of **incorrect** code for this rule:

```js
expect(el.style.foo).toBe("bar");
expect(el.style.foo).not.toBe("bar");
expect(el.style).toHaveProperty("background-color", "green");
expect(screen.getByTestId("foo").style["scroll-snap-type"]).toBe("x mandatory");
expect(el.style).toContain("background-color");
expect(el.style).not.toContain("background-color");
expect(el).toHaveAttribute(
  "style",
  "background-color: green; border-width: 10px; color: blue;"
);
```

Examples of **correct** code for this rule:

```js
expect(el).toHaveStyle({ foo: "bar" });
expect(el.style).toMatchSnapshot();
expect(el.style).toEqual(foo);
```

## When Not To Use It

If you don't care about using built in matchers for checking style on dom
elements.

## Further Reading

- [jest-dom toHaveStyle](https://github.com/testing-library/jest-dom#tohavestyle)
- [ElementCSSInlineStyle.style](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style)
