# Prefer asserting DOM node presence with .toBeInTheDocument over .toHaveLength (prefer-in-document)

## Rule Details

This rule enforces checking existance of DOM nodes using `.toBeInTheDocument()`
instead of asserting on the length of a query result using `.toHaveLength(1)`.

Examples of **incorrect** code for this rule:

```js
expect(screen.queryByText("foo")).toHaveLength(1);
```

Examples of **correct** code for this rule:

```js
expect(screen.queryByText("foo")).toBeInTheDocument();
```

## When Not To Use It

Don't use this rule if you don't care about the added readability and
improvements that `toBeInTheDocument` offers to your expects.

## Further Reading

- [Docs on toBeInTheDocument](https://github.com/testing-library/jest-dom#tobeinthedocument)
