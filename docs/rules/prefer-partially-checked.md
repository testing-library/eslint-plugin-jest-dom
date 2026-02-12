# Prefer toBePartiallyChecked over checking attributes (`jest-dom/prefer-partially-checked`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule suggests using `toBePartiallyChecked()` instead of checking for the
`"mixed"` value of the `aria-checked` attribute with `.toHaveAttribute()` or
`.toHaveProperty()`. This improves readability and ensures you are using the
semantically correct jest-dom matcher.

Examples of **incorrect** code for this rule:

```js
expect(element).toHaveAttribute("aria-checked", "mixed");
expect(element).toHaveProperty("aria-checked", "mixed");
expect(element).not.toHaveAttribute("aria-checked", "mixed");
```

Examples of **correct** code for this rule:

```js
expect(element).toBePartiallyChecked();

expect(element).not.toBePartiallyChecked();

expect(element).toHaveAttribute("aria-checked", "true");
expect(element).toHaveAttribute("aria-checked", "false");
```

## When Not To Use It

Don't use this rule if you:

- don't use `jest-dom`
- want to allow `.toHaveAttribute()` and `.toHaveProperty()` for `aria-checked="mixed"`

## Further Reading

- [jest-dom `toBePartiallyChecked`](https://github.com/testing-library/jest-dom#tobepartiallychecked)
