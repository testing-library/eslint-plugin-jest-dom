# jest-dom/prefer-to-be-invalid

📝 Prefer toBeInvalid over checking aria-invalid or validity state.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to improve readability and should only be used with the
`@testing-library/jest-dom` package. It reports assertions that say that an
element is invalid through its `aria-invalid` attribute or its native validity
state.

The autofix replaces the assertion with `toBeInvalid()`. Note that
`toBeInvalid()` passes if an element has `aria-invalid` **or** if its
`checkValidity()` returns `false`, so in rare cases it can be weaker than the
assertion it replaces.

Examples of **incorrect** code for this rule:

```js
const input = screen.getByRole("textbox");

expect(input).toHaveAttribute("aria-invalid", "true");
expect(input).toHaveProperty("validity.valid", false);
expect(input.checkValidity()).toBe(false);
expect(input.validity.valid).toBe(false);
```

Examples of **correct** code for this rule:

```js
const input = screen.getByRole("textbox");

expect(input).toBeInvalid();

// not the same as toBeInvalid()
expect(input).toHaveAttribute("aria-invalid", "grammar");
expect(input).not.toHaveAttribute("aria-invalid", "true");
expect(input.validity.valueMissing).toBe(true);
```

## When Not To Use It

Don't use this rule if you:

- don't use `jest-dom`
- want to check `aria-invalid` and the native validity separately

## Further Reading

- [jest-dom `toBeInvalid`](https://github.com/testing-library/jest-dom#tobeinvalid)
