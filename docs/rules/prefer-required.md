# Prefer toBeRequired over checking properties (`jest-dom/prefer-required`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent false positives and improve readability and should
only be used with the `@testing-library/jest-dom` package. See below for
examples of those potential issues and why this rule is recommended. The rule is
autofixable and will replace any instances of `.toHaveProperty()` or
`.toHaveAttribute()` with `toBeRequired()` or `not.toBeRequired` as appropriate.

### False positives

Consider these 2 snippets:

```js
const { getByRole } = render(<input type="checkbox" required />);
const element = getByRole("checkbox");
expect(element).toHaveProperty("required"); // passes

const { getByRole } = render(<input type="checkbox" />);
const element = getByRole("checkbox");
expect(element).toHaveProperty("required"); // also passes 😱
```

### Readability

Consider the following snippets:

```js
const { getByRole } = render(<input type="checkbox" />);
const element = getByRole("checkbox");

expect(element).toHaveAttribute("required", false); // fails
expect(element).toHaveAttribute("required", ""); // fails
expect(element).not.toHaveAttribute("required", ""); // passes

expect(element).not.toHaveAttribute("required", true); // passes.
expect(element).not.toHaveAttribute("required", false); // also passes.
```

As you can see, using `toHaveAttribute` in this case is confusing, unintuitive
and can even lead to false positive tests.

Examples of **incorrect** code for this rule:

```js
expect(element).toHaveProperty("required", true);
expect(element).toHaveAttribute("required", false);

expect(element).toHaveAttribute("required");
expect(element).not.toHaveProperty("required");

expect(element).not.toBeRequired();
expect(element).not.not.toBeRequired();
```

Examples of **correct** code for this rule:

```js
expect(element).not.toBeRequired();

expect(element).toBeRequired();

expect(element).toHaveProperty("aria-label", "foo");

expect(element).toHaveAttribute("alt");
```

## When Not To Use It

Don't use this rule if you:

- don't use `jest-dom`
- want to allow `.toHaveProperty('required', true|false);`

## Further reading

- [toBeRequired](https://github.com/testing-library/jest-dom#toBeRequired)
- [not.toBeRequired](https://github.com/testing-library/jest-dom#not.toBeRequired)
