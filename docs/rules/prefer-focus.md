# Prefer toHaveFocus over checking document.activeElement (`jest-dom/prefer-focus`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

prefer toHaveFocus over checking document.activeElement (prefer-focus)

## Rule Details

This autofixable rule aims to improve readability & consistency of tests with
the use of the jest-dom matcher `toHaveFocus` rather than checking
document.activeElement.

Examples of **incorrect** code for this rule:

```js
expect(document.activeElement).toBe(foo);
expect(window.document.activeElement).toBe(foo);
expect(global.window.document.activeElement).toBe(foo);
expect(global.document.activeElement).toBe(foo);
expect(foo).toBe(global.document.activeElement);
expect(foo).toBe(window.document.activeElement);
expect(foo).toBe(global.window.document.activeElement);
expect(foo).toBe(document.activeElement);
expect(foo).toEqual(document.activeElement);

expect(document.activeElement).not.toBe(foo);
expect(window.document.activeElement).not.toBe(foo);
expect(global.window.document.activeElement).not.toBe(foo);
expect(global.document.activeElement).not.toBe(foo);
expect(foo).not.toBe(global.document.activeElement);
expect(foo).not.toBe(window.document.activeElement);
expect(foo).not.toBe(global.window.document.activeElement);
expect(foo).not.toBe(document.activeElement);
expect(foo).not.toEqual(document.activeElement);
```

Examples of **correct** code for this rule:

```js
expect(input).not.toHaveFocus();
expect(document.activeElement).not.toBeNull();

expect(input).toHaveFocus();
expect(document.activeElement).toBeNull();
```

## When Not To Use It

If you don't care if people use toHaveFocus
