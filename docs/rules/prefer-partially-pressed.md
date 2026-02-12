# Prefer toBePartiallyPressed over checking attributes (`jest-dom/prefer-partially-pressed`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule suggests using `toBePartiallyPressed()` instead of checking for the
`"mixed"` value of the `aria-pressed` attribute with `.toHaveAttribute()` or
`.toHaveProperty()`. This improves readability and ensures you are using the
semantically correct jest-dom matcher.

Examples of **incorrect** code for this rule:

```js
expect(element).toHaveAttribute("aria-pressed", "mixed");
expect(element).toHaveProperty("aria-pressed", "mixed");
expect(element).not.toHaveAttribute("aria-pressed", "mixed");
```

Examples of **correct** code for this rule:

```js
expect(element).toBePartiallyPressed();

expect(element).not.toBePartiallyPressed();

expect(element).toHaveAttribute("aria-pressed", "true");
expect(element).toHaveAttribute("aria-pressed", "false");
```

## When Not To Use It

Don't use this rule if you:

- don't use `jest-dom`
- want to allow `.toHaveAttribute()` and `.toHaveProperty()` for `aria-pressed="mixed"`

## Further Reading

- [jest-dom `toBePartiallyPressed`](https://github.com/testing-library/jest-dom#tobepartiallypressed)
