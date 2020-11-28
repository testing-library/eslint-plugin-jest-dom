# Prefer .toBeInTheDocument in favor of .toHaveLength(1) (prefer-in-document)

## Rule Details

This rule enforces checking existance of DOM nodes using `.toBeInTheDocument()`.
The rule prefers that matcher over various existance checks such as `.toHaveLength(1)`, `.not.toBeNull()` and
similar.

Examples of **incorrect** code for this rule:

```js
expect(screen.queryByText("foo")).toHaveLength(1);
expect(queryByText("foo")).toHaveLength(1);
expect(wrapper.queryByText("foo")).toHaveLength(1);
expect(queryByText("foo")).toHaveLength(0);
expect(queryByText("foo")).toBeNull();
expect(queryByText("foo")).not.toBeNull();
expect(queryByText("foo")).toBeDefined();
expect(queryByText("foo")).not.toBeDefined();

const foo = screen.getByText("foo");
expect(foo).toHaveLength(1);

const bar = screen.queryByText("bar");
expect(bar).toHaveLength(0);
```

Examples of **correct** code for this rule:

```js
expect(screen.queryByText("foo")).toBeInTheDocument();
expect(screen.queryByText("foo")).toBeInTheDocument();
expect(queryByText("foo")).toBeInTheDocument();
expect(wrapper.queryAllByTestId("foo")).toBeInTheDocument();
expect(screen.getAllByLabel("foo-bar")).toHaveLength(2);
expect(notAQuery("foo-bar")).toHaveLength(1);

const foo = screen.getAllByText("foo");
expect(foo).toHaveLength(3);

const bar = screen.queryByText("bar");
expect(bar).not.toBeInTheDocument();
```

## When Not To Use It

Don't use this rule if you don't care about the added readability and
improvements that `toBeInTheDocument` offers to your expects.

## Further Reading

- [Docs on toBeInTheDocument](https://github.com/testing-library/jest-dom#tobeinthedocument)
