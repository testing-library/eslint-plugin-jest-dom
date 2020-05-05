# Prefer toBeEmpty over checking innerHTML / firstChild (prefer-empty)

This rule ensures people will use toBeEmpty() rather than checking dom nodes/properties. It is primarily aimed at consistently using jest-dom for readability.

## Rule Details

This autofixable rule aims to ensure usage of `.toBeEmpty()`

Examples of **incorrect** code for this rule:

```js
expect(element.innerHTML).toBe("foo");
expect(element.innerHTML).not.toBe("foo");
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

Examples of **correct** code for this rule:

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

Don't use this rule if you don't care if people use `.toBeEmpty()`.

## Further Reading

<https://github.com/testing-library/jest-dom#tobeempty>

<https://github.com/testing-library/jest-dom/blob/master/src/to-be-empty.js>
