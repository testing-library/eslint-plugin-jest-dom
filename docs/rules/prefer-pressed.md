# Prefer toBePressed over checking attributes (`jest-dom/prefer-pressed`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent false positives and improve readability and should
only be used with the `@testing-library/jest-dom` package. The rule is
autofixable and will replace any instances of `.toHaveProperty()` or
`.toHaveAttribute()` with `.toBePressed()` or `not.toBePressed()` as
appropriate.

Note: This rule does not flag checks for `aria-pressed="mixed"`. Use the
`prefer-partially-pressed` rule for that case.

Examples of **incorrect** code for this rule:

```js
expect(element).toHaveProperty("aria-pressed", true);
expect(element).toHaveAttribute("aria-pressed", false);
expect(element).toHaveProperty("aria-pressed", something);

expect(element).toHaveAttribute("aria-pressed");
expect(element).not.toHaveProperty("aria-pressed");

expect(element).not.not.toBePressed();
```

Examples of **correct** code for this rule:

```js
expect(element).toBePressed();

expect(element).not.toBePressed();

expect(element).toHaveAttribute("aria-label");

expect(element).toHaveAttribute("aria-pressed", "mixed");
```

## When Not To Use It

Don't use this rule if you:

- don't use `jest-dom`
- want to allow `.toHaveAttribute()` and `.toHaveProperty()` for `aria-pressed`

## Further Reading

- [jest-dom `toBePressed`](https://github.com/testing-library/jest-dom#tobepressed)
