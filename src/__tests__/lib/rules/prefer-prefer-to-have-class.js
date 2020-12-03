import { RuleTester } from "eslint";
import * as rule from "../../../rules/prefer-to-have-class";

const errors = [{ messageId: "use-to-have-class" }];
const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("prefer-to-have-class", rule, {
  valid: [
    `expect(el).toHaveClass("bar")`,
    `expect(el.class).toEqual(foo)`,
    `expect(el).toHaveAttribute("class")`,
    `expect(el).toHaveAttribute("className", "bar")`,
    `expect(el).toHaveProperty("class", "foo")`,
  ],
  invalid: [
    {
      code: `expect(screen.getByRole("button").className).toBe("foo")`,
      errors,
      output: `expect(screen.getByRole("button")).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(screen.getByRole("button").className).not.toBe("foo")`,
      errors,
      output: `expect(screen.getByRole("button")).not.toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(el).toHaveProperty("className", "foo")`,
      errors,
      output: `expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(el).toHaveAttribute("class", "foo")`,
      errors,
      output: `expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(el).toHaveAttribute(\`class\`, "foo")`,
      errors,
      output: `expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(el).toHaveAttribute("class", expect.stringContaining("bar"))`,
      errors,
      output: `expect(el).toHaveClass("bar")`,
    },
    {
      code: `expect(el).toHaveAttribute(\`class\`, expect.stringContaining("bar"))`,
      errors,
      output: `expect(el).toHaveClass("bar")`,
    },
    {
      code: `expect(el).not.toHaveProperty("className", "foo")`,
      errors,
      output: `expect(el).not.toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(el).not.toHaveAttribute("class", "foo")`,
      errors,
      output: `expect(el).not.toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(el.className).toContain("foo")`,
      errors,
      output: `expect(el).toHaveClass("foo")`,
    },
    {
      code: `expect(el.className).toBe("foo")`,
      errors,
      output: `expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(el.className).toEqual("foo")`,
      errors,
      output: `expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(el.className).toStrictEqual("foo")`,
      errors,
      output: `expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(el.className).toEqual(expect.stringContaining("foo"))`,
      errors,
      output: `expect(el).toHaveClass("foo")`,
    },
    {
      code: `expect(el.className).toEqual(expect.stringContaining(\`foo\`))`,
      errors,
      output: `expect(el).toHaveClass(\`foo\`)`,
    },
    {
      code: `expect(el.className).toStrictEqual(expect.stringContaining("foo"))`,
      errors,
      output: `expect(el).toHaveClass("foo")`,
    },
    {
      code: `expect(el.className).toEqual(expect.stringContaining("bar"))`,
      errors,
      output: `expect(el).toHaveClass("bar")`,
    },
  ],
});
