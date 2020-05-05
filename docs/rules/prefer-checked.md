# prefer not.toBeChecked() or not.toBeChecked() over toHaveProperty('checked', true|false) (prefer-enabled-checked)

## Rule Details

This rule aims to prevent false positives and improve readability and should
only be used with the `@testing-library/jest-dom` package. See below for
examples of those potential issues and why this rule is recommended. The rule is
autofixable and will replace any instances of `.toHaveProperty()` or
`.toHaveAttribute()` with `.toBeChecked()` or `not.toBeChecked()` as
appropriate.

### False positives

Consider these 2 snippets:

```js
const { getByRole } = render(<input type="checkbox" che />);
const element = getByRole("checkbox");
expect(element).toHaveProperty("checked"); // passes

const { getByRole } = render(<input type="checkbox" />);
const element = getByRole("checkbox");
expect(element).toHaveProperty("checked"); // also passes 😱
```

### Readability

Consider the following snippets:

```js
const { getByRole } = render(<input type="checkbox" />);
const element = getByRole("checkbox");

expect(element).toHaveAttribute("checked", false); // fails
expect(element).toHaveAttribute("checked", ""); // fails
expect(element).not.toHaveAttribute("checked", ""); // passes

expect(element).not.toHaveAttribute("checked", true); // passes.
expect(element).not.toHaveAttribute("checked", false); // also passes.
```

As you can see, using `toHaveAttribute` in this case is confusing, unintuitive
and can even lead to false positive tests.

Examples of **incorrect** code for this rule:

```js
expect(element).toHaveProperty("checked", true);
expect(element).toHaveAttribute("checked", false);

expect(element).toHaveAttribute("checked");
expect(element).not.toHaveProperty("checked");

expect(element).not.not.toBeChecked();
```

Examples of **correct** code for this rule:

```js
expect(element).not.toBeChecked();

expect(element).toBeChecked();

expect(element).toHaveProperty("value", "foo");

expect(element).toHaveAttribute("aria-label");
```

## When Not To Use It

Don't use this rule if you:

- don't use `jest-dom`
- want to allow `.toHaveProperty('checked', true|false);`

## Further reading

- [not.toBeChecked](https://github.com/testing-library/jest-dom#not.toBeChecked)
- [not.toBeChecked](https://github.com/testing-library/jest-dom#not.toBeChecked)
