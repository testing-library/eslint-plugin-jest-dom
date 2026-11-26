import { FlatCompatRuleTester as RuleTester } from "../../rule-tester";
import * as rule from "../../../rules/prefer-to-be-invalid";

const query = `const input = screen.getByRole("textbox");`;

const invalid = (code, found, output) => ({
  code,
  errors: [{ messageId: "preferInvalid", data: { found } }],
  output,
});

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: "module" },
});
ruleTester.run("prefer-to-be-invalid", rule, {
  valid: [
    `expect().toBe(false)`,
    `${query} expect(input).toBeInvalid()`,
    `${query} expect(input).not.toBeInvalid()`,
    // not the same as toBeInvalid()
    `${query} expect(input).toHaveAttribute("aria-invalid")`,
    `${query} expect(input).toHaveAttribute("aria-invalid", "false")`,
    `${query} expect(input).toHaveAttribute("aria-invalid", "grammar")`,
    `${query} expect(input).toHaveAttribute("aria-invalid", value)`,
    `${query} expect(input).not.toHaveAttribute("aria-invalid", "true")`,
    `${query} expect(input).toHaveAttribute("aria-required", "true")`,
    `${query} expect(input).toHaveProperty("validity.valid")`,
    `${query} expect(input).toHaveProperty("validity.valid", true)`,
    `${query} expect(input).not.toHaveProperty("validity.valid", false)`,
    `${query} expect(input).toHaveProperty("validity.valueMissing", false)`,
    `${query} expect(input).toHaveProperty(["validity"], false)`,
    `${query} expect(input.checkValidity()).toBe(true)`,
    `${query} expect(input.checkValidity()).not.toBe(false)`,
    `${query} expect(input.checkValidity()).toBe()`,
    `${query} expect(input.checkValidity()).toBe(null)`,
    `${query} expect(input.checkValidity()).toBeTruthy()`,
    `${query} expect(input.checkValidity).toBe(false)`,
    `${query} expect(input.reportValidity()).toBe(false)`,
    `${query} expect(input.validity.valid).toBe(true)`,
    `${query} expect(input.validity.valueMissing).toBe(false)`,
    `${query} expect(input[validity].valid).toBe(false)`,
    `${query} expect(input.valid).toBe(false)`,
    // not known to be an element
    `const form = new Form(); expect(form.checkValidity()).toBe(false)`,
    `const field = {}; expect(field.validity.valid).toBe(false)`,
    `const field = {}; expect(field).toHaveProperty("validity.valid", false)`,
    `const field = {}; expect(field).toHaveAttribute("aria-invalid", "true")`,
  ],

  invalid: [
    invalid(
      `${query} expect(input).toHaveAttribute("aria-invalid", "true")`,
      "checking aria-invalid",
      `${query} expect(input).toBeInvalid()`,
    ),
    invalid(
      `expect(screen.getByLabelText("Name")).toHaveAttribute('aria-invalid', 'true')`,
      "checking aria-invalid",
      `expect(screen.getByLabelText("Name")).toBeInvalid()`,
    ),
    invalid(
      `${query} expect(input).toHaveProperty("validity.valid", false)`,
      "checking validity.valid",
      `${query} expect(input).toBeInvalid()`,
    ),
    invalid(
      `${query} expect(input).toHaveProperty(["validity", "valid"], false)`,
      "checking validity.valid",
      `${query} expect(input).toBeInvalid()`,
    ),
    ...["toBe(false)", "toEqual(false)", "toStrictEqual(false)", "toBeFalsy()"]
      .map((matcher) => [
        invalid(
          `${query} expect(input.checkValidity()).${matcher}`,
          "checking checkValidity()",
          `${query} expect(input).toBeInvalid()`,
        ),
        invalid(
          `${query} expect(input.validity.valid).${matcher}`,
          "checking validity.valid",
          `${query} expect(input).toBeInvalid()`,
        ),
      ])
      .flat(),
    invalid(
      `expect(getByRole("textbox").checkValidity()).toBe(false)`,
      "checking checkValidity()",
      `expect(getByRole("textbox")).toBeInvalid()`,
    ),
    invalid(
      `async () => { expect((await screen.findByRole("textbox")).checkValidity()).toBe(false) }`,
      "checking checkValidity()",
      `async () => { expect(await screen.findByRole("textbox")).toBeInvalid() }`,
    ),
    invalid(
      `async () => { const input = await screen.findByRole("textbox"); expect(input.validity.valid).toBe(false) }`,
      "checking validity.valid",
      `async () => { const input = await screen.findByRole("textbox"); expect(input).toBeInvalid() }`,
    ),
  ],
});
