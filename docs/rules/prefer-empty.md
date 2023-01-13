# Prefer toBeEmpty over checking innerHTML (`jest-dom/prefer-empty`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule ensures people will use toBeEmptyDOMElement() rather than checking dom
nodes/properties. It is primarily aimed at consistently using jest-dom for
readability.

## Rule Details

This autofixable rule aims to ensure usage of `.toBeEmptyDOMElement()`

Examples of **correct** code for this rule:

```js
expect(element.innerHTML).toBe("foo");
expect(element.innerHTML).toBe(foo);
expect(element.innerHTML).not.toBe("foo");
expect(element.innerHTML).not.toBe(foo);
expect(element.firstChild).toBe("foo");
expect(element.firstChild).not.toBe("foo");
expect(getByText("foo").innerHTML).toBe("foo");
expect(getByText("foo").innerHTML).not.toBe("foo");
expect(getByText("foo").firstChild).toBe("foo");
expect(getByText("foo").firstChild).not.toBe("foo");
expect(element.innerHTML === "").toBe(true);
expect(element.innerHTML !== "").toBe(true);
expect(element.innerHTML === "").toBe(false);
expect(element.innerHTML !== "").toBe(false);
expect(element.firstChild === null).toBe(true);
expect(element.firstChild !== null).toBe(false);
expect(element.firstChild === null).toBe(false);
```

Examples of **incorrect** code for this rule:

```js
expect(element.innerHTML).toBe("");
expect(element.innerHTML).toBe(null);
expect(element.innerHTML).not.toBe(null);
expect(element.innerHTML).not.toBe("");
expect(element.firstChild).toBeNull();
expect(element.firstChild).toBe(null);
expect(element.firstChild).not.toBe(null);
expect(element.firstChild).not.toBeNull();
expect(getByText("foo").innerHTML).toBe("");
expect(getByText("foo").innerHTML).toStrictEqual("");
expect(getByText("foo").innerHTML).toStrictEqual(null);
expect(getByText("foo").firstChild).toBe(null);
expect(getByText("foo").firstChild).not.toBe(null);
expect(element.innerHTML === "foo").toBe(true);
```

## When Not To Use It

Don't use this rule if you don't care if people use `.toBeEmptyDOMElement()`.

## Further Reading

<https://github.com/testing-library/jest-dom#tobeemptydomelement>

<https://github.com/testing-library/jest-dom/blob/main/src/to-be-empty-dom-element.js>

## Changelog

Previously, this rule was using `.toBeEmpty` which has been [deprecated](https://github.com/testing-library/jest-dom/releases/tag/v5.9.0) in `@testing-library/jest-dom@5.9.0`.
