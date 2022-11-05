# Prefer .toBeInTheDocument() for asserting the existence of a DOM node (`jest-dom/prefer-in-document`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

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
expect(queryByText("foo")).toBe(null);
expect(queryByText("foo")).not.toBe(null);
expect(queryByText("foo")).toEqual(null);
expect(queryByText("foo")).not.toEqual(null);
expect(queryByText("foo")).toBeDefined();
expect(queryByText("foo")).not.toBeDefined();
expect(queryByText("foo")).toBeTruthy();
expect(queryByText("foo")).not.toBeTruthy();
expect(queryByText("foo")).toBeFalsy();
expect(queryByText("foo")).not.toBeFalsy();

const foo = screen.getByText("foo");
expect(foo).toHaveLength(1);

const bar = screen.queryByText("bar");
expect(bar).toHaveLength(0);
```

Examples of **correct** code for this rule:

```js
expect(screen.getByText("foo").length).toBe(1);
expect(screen.queryByText("foo")).toBeInTheDocument();
expect(await screen.findByText("foo")).toBeInTheDocument();
expect(queryByText("foo")).toBeInTheDocument();
expect(wrapper.queryAllByTestId("foo")).toBeInTheDocument();
expect(screen.getAllByLabel("foo-bar")).toHaveLength(2);
expect(notAQuery("foo-bar")).toHaveLength(1);

const foo = screen.getAllByText("foo");
expect(foo).toHaveLength(3);

const bar = screen.queryByText("bar");
expect(bar).not.toBeDefined();

const baz = await screen.findByText("baz");
expect(baz).toBeDefined();
```

## When Not To Use It

Don't use this rule if you don't care about the added readability and
improvements that `toBeInTheDocument` offers to your expects.

Note, that `expect(screen.getByText("foo").length).toBe(1)` is valid. If you want to report on that please use [jest/prefer-to-have-length](https://github.com/jest-community/eslint-plugin-jest/blob/HEAD/docs/rules/prefer-to-have-length.md)
![fixable][] which will first convert those use cases to use `.toHaveLength`.

## Further Reading

- [Docs on toBeInTheDocument](https://github.com/testing-library/jest-dom#tobeinthedocument)

[fixable]: https://img.shields.io/badge/-fixable-green.svg
