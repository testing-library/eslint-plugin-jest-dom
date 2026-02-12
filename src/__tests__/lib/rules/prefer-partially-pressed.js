/**
 * @fileoverview prefer toBePartiallyPressed over checking aria-pressed for mixed state
 */

import { RuleTester } from "eslint";
import * as rule from "../../../rules/prefer-partially-pressed";

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: "module" },
});

ruleTester.run("prefer-partially-pressed", rule, {
  valid: [
    `expect(element).toBePartiallyPressed()`,
    `expect(element).not.toBePartiallyPressed()`,
    `const el = screen.getByText("foo"); expect(el).toBePartiallyPressed()`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("aria-pressed", "true")`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("aria-pressed", "false")`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("aria-pressed")`,
    `const el = screen.getByText("foo"); expect(el).toHaveProperty("aria-pressed", "true")`,
    `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute("aria-pressed")`,
    `const el = foo.bar(); expect(el).toHaveAttribute("aria-pressed", "mixed")`,
    `const el = foo.bar(); expect(el).toHaveProperty("aria-pressed", "mixed")`,
  ],
  invalid: [
    {
      code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute("aria-pressed", "mixed")`,
      errors: [
        {
          message: `Use toBePartiallyPressed() instead of toHaveAttribute('aria-pressed', 'mixed')`,
        },
      ],
      output: `const el = screen.getByText("foo"); expect(el).toBePartiallyPressed()`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).toHaveProperty("aria-pressed", "mixed")`,
      errors: [
        {
          message: `Use toBePartiallyPressed() instead of toHaveProperty('aria-pressed', 'mixed')`,
        },
      ],
      output: `const el = screen.getByText("foo"); expect(el).toBePartiallyPressed()`,
    },
    {
      code: `expect(getByText("foo")).toHaveAttribute("aria-pressed", "mixed")`,
      errors: [
        {
          message: `Use toBePartiallyPressed() instead of toHaveAttribute('aria-pressed', 'mixed')`,
        },
      ],
      output: `expect(getByText("foo")).toBePartiallyPressed()`,
    },
    {
      code: `expect(getByRole("button")).toHaveAttribute("aria-pressed", "mixed")`,
      errors: [
        {
          message: `Use toBePartiallyPressed() instead of toHaveAttribute('aria-pressed', 'mixed')`,
        },
      ],
      output: `expect(getByRole("button")).toBePartiallyPressed()`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute("aria-pressed", "mixed")`,
      errors: [
        {
          message: `Use not.toBePartiallyPressed() instead of not.toHaveAttribute('aria-pressed', 'mixed')`,
        },
      ],
      output: `const el = screen.getByText("foo"); expect(el).not.toBePartiallyPressed()`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).not.toHaveProperty("aria-pressed", "mixed")`,
      errors: [
        {
          message: `Use not.toBePartiallyPressed() instead of not.toHaveProperty('aria-pressed', 'mixed')`,
        },
      ],
      output: `const el = screen.getByText("foo"); expect(el).not.toBePartiallyPressed()`,
    },
    {
      code: `expect(getByText("foo")).not.toHaveAttribute("aria-pressed", "mixed")`,
      errors: [
        {
          message: `Use not.toBePartiallyPressed() instead of not.toHaveAttribute('aria-pressed', 'mixed')`,
        },
      ],
      output: `expect(getByText("foo")).not.toBePartiallyPressed()`,
    },
  ],
});
