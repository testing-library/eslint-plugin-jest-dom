/**
 * @fileoverview prefer toBePartiallyChecked over checking aria-checked for mixed state
 */

import { RuleTester } from "eslint";
import * as rule from "../../../rules/prefer-partially-checked";

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: "module" },
});

ruleTester.run("prefer-partially-checked", rule, {
  valid: [
    `expect(element).toBePartiallyChecked()`,
    `expect(element).not.toBePartiallyChecked()`,
    `const el = screen.getByText("foo"); expect(el).toBePartiallyChecked()`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("aria-checked", "true")`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("aria-checked", "false")`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("aria-checked")`,
    `const el = screen.getByText("foo"); expect(el).toHaveProperty("aria-checked", "true")`,
    `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute("aria-checked")`,
    `const el = foo.bar(); expect(el).toHaveAttribute("aria-checked", "mixed")`,
    `const el = foo.bar(); expect(el).toHaveProperty("aria-checked", "mixed")`,
  ],
  invalid: [
    {
      code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute("aria-checked", "mixed")`,
      errors: [
        {
          message: `Use toBePartiallyChecked() instead of toHaveAttribute('aria-checked', 'mixed')`,
        },
      ],
      output: `const el = screen.getByText("foo"); expect(el).toBePartiallyChecked()`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).toHaveProperty("aria-checked", "mixed")`,
      errors: [
        {
          message: `Use toBePartiallyChecked() instead of toHaveProperty('aria-checked', 'mixed')`,
        },
      ],
      output: `const el = screen.getByText("foo"); expect(el).toBePartiallyChecked()`,
    },
    {
      code: `expect(getByText("foo")).toHaveAttribute("aria-checked", "mixed")`,
      errors: [
        {
          message: `Use toBePartiallyChecked() instead of toHaveAttribute('aria-checked', 'mixed')`,
        },
      ],
      output: `expect(getByText("foo")).toBePartiallyChecked()`,
    },
    {
      code: `expect(getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed")`,
      errors: [
        {
          message: `Use toBePartiallyChecked() instead of toHaveAttribute('aria-checked', 'mixed')`,
        },
      ],
      output: `expect(getByRole("checkbox")).toBePartiallyChecked()`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute("aria-checked", "mixed")`,
      errors: [
        {
          message: `Use not.toBePartiallyChecked() instead of not.toHaveAttribute('aria-checked', 'mixed')`,
        },
      ],
      output: `const el = screen.getByText("foo"); expect(el).not.toBePartiallyChecked()`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).not.toHaveProperty("aria-checked", "mixed")`,
      errors: [
        {
          message: `Use not.toBePartiallyChecked() instead of not.toHaveProperty('aria-checked', 'mixed')`,
        },
      ],
      output: `const el = screen.getByText("foo"); expect(el).not.toBePartiallyChecked()`,
    },
    {
      code: `expect(getByText("foo")).not.toHaveAttribute("aria-checked", "mixed")`,
      errors: [
        {
          message: `Use not.toBePartiallyChecked() instead of not.toHaveAttribute('aria-checked', 'mixed')`,
        },
      ],
      output: `expect(getByText("foo")).not.toBePartiallyChecked()`,
    },
  ],
});
