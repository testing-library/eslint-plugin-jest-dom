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
    `expect(el).toHaveAttribute("clazz", "bar")`,
    `expect(el).not.toHaveAttribute("clazz", "bar")`,
    `expect(el).not.toHaveAttribute("clazz", expect.stringContaining("bar"))`,
    `expect(el).toHaveAttribute("clazz", expect.stringContaining("bar"))`,
    `expect(el).toHaveProperty("class", "foo")`,
    `expect(el).toHaveProperty("clazz", "foo")`,
    `expect(el).not.toHaveProperty("clazz", "foo")`,
    `expect(el).toHaveProperty("clazz", expect.stringContaining("bar"))`,
    `expect(el).not.toHaveProperty("clazz", expect.stringContaining("bar"))`,
    `expect(closeButton).toHaveAttribute("class", expect.stringMatching("bar"));`,
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
      code: `expect(el.className).not.toContain("foo")`,
      errors,
      output: `expect(el).not.toHaveClass("foo")`,
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
    {
      code: `expect(el.classList).toContain("bar")`,
      errors,
      output: `expect(el).toHaveClass("bar")`,
    },
    {
      code: `expect(el.classList).toBe("bar")`,
      errors,
    },
    {
      code: `expect(el.classList[0]).toBe("bar")`,
      errors,
      output: `expect(el).toHaveClass("bar")`,
    },
    {
      code: `expect(el.classList[0]).not.toBe("bar")`,
      errors,
    },
    {
      code: `expect(el.classList[0]).toContain(("fo"))`,
      errors,
    },

    {
      code: `expect(el.classList).toEqual(expect.objectContaining({0:"foo"}))`,
      errors,
    },

    {
      code: `expect(el.classList).toContain(className)`,
      errors,
      output: `expect(el).toHaveClass(className)`,
    },
    {
      code: `expect(el.classList).toContain("className")`,
      errors,
      output: `expect(el).toHaveClass("className")`,
    },

    {
      code: `expect(el.classList).toContain(foo("bar"))`,
      errors,
      output: `expect(el).toHaveClass(foo("bar"))`,
    },

    {
      code: `expect(el.classList.contains("foo")).toBe(false)`,
      errors,
      output: `expect(el).not.toHaveClass("foo")`,
    },

    {
      code: `expect(el.classList.contains("foo")).toBe(true)`,
      errors,
      output: `expect(el).toHaveClass("foo")`,
    },
    {
      code: `expect(el.classList.contains("foo")).toBeTruthy()`,
      errors,
      output: `expect(el).toHaveClass("foo")`,
    },
    {
      code: `expect(el.classList).not.toContain("bar")`,
      errors,
      output: `expect(el).not.toHaveClass("bar")`,
    },
    {
      code: `expect(el.classList).not.toBe("bar")`,
      errors,
    },
    {
      code: `expect(el.classList[0]).not.toContain(("fo"))`,
      errors,
    },

    {
      code: `expect(el.classList).not.toEqual(expect.objectContaining({0:"foo"}))`,
      errors,
    },

    {
      code: `expect(el.classList).not.toContain(className)`,
      errors,
      output: `expect(el).not.toHaveClass(className)`,
    },
    {
      code: `expect(el.classList).not.toContain("className")`,
      errors,
      output: `expect(el).not.toHaveClass("className")`,
    },

    {
      code: `expect(el.classList).not.toContain(foo("bar"))`,
      errors,
      output: `expect(el).not.toHaveClass(foo("bar"))`,
    },
  ],
});
