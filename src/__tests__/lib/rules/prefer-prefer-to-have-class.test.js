import { FlatCompatRuleTester as RuleTester } from "../../rule-tester";
import * as rule from "../../../rules/prefer-to-have-class";

const errors = [{ messageId: "use-to-have-class" }];
const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("prefer-to-have-class", rule, {
  valid: [
    `expect().toBe(true)`,
    // classList.length is not a class name
    `const el = screen.getByText("foo"); expect(el.classList.length).toBe(0)`,
    `const el = screen.getByText("foo"); expect(el.classList.length).toEqual(2)`,
    `const el = screen.getByText("foo"); expect(el.classList.length).not.toBe(0)`,
    `const el = screen.getByText("foo"); expect(el.classList["length"]).toBe(0)`,
    `const el = screen.getByText("foo"); expect(el.classList["value"]).toBe("bar")`,
    `const el = screen.getByText("foo"); expect(el.classList[\`value\`]).toEqual("bar")`,
    `const el = screen.getByText("foo"); expect(el.classList["length"]).not.toBe(0)`,
    `const el = screen.getByText("foo"); expect(el.classList["value"]).not.toBe("bar")`,
    `const el = screen.getByText("foo"); expect(el.classList.value.length).toBe(3)`,
    `const el = screen.getByText("foo"); expect(el.classList.value).toMatch(/bar/)`,
    `const model = { classList: { value: "foo" } }; expect(model.classList.value).toBe("foo")`,
    `const el = screen.getByText("foo"); expect(el).toHaveClass("bar")`,
    `const el = screen.getByText("foo"); expect(el.class).toEqual(foo)`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("class")`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("className", "bar")`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("clazz", "bar")`,
    `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute("clazz", "bar")`,
    `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute("clazz", expect.stringContaining("bar"))`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("clazz", expect.stringContaining("bar"))`,
    `const el = screen.getByText("foo"); expect(el).toHaveProperty("class", "foo")`,
    `const el = screen.getByText("foo"); expect(el).toHaveProperty("clazz", "foo")`,
    `const el = screen.getByText("foo"); expect(el).not.toHaveProperty("clazz", "foo")`,
    `const el = screen.getByText("foo"); expect(el).toHaveProperty("clazz", expect.stringContaining("bar"))`,
    `const el = screen.getByText("foo"); expect(el).not.toHaveProperty("clazz", expect.stringContaining("bar"))`,
    `const el = screen.getByText("foo"); expect(el).toHaveAttribute("class", expect.stringMatching("bar"));`,
    `const { result } = renderHook(() =>
        useMyHook({
          classes,
        })  
    );

    expect(result.current.className).toBe("foo");`,
    `const { result } = renderHook(() =>
        useMyHook({
          classes,
        })  
    );

    expect(result.current.className).toEqual(expect.stringContaining("foo"));`,
    `const { result } = renderHook(() =>
        useMyHook({
          classes,
        })  
    );

    expect(result.current.className).not.toBe("foo");`,
    `const el = getFoo(); expect(el).toHaveProperty("className", "foo: bar")`,
    `const el = getFoo(); expect(el).not.toHaveProperty("className", "foo: bar")`,
    `const el = getFoo(); expect(el).toHaveProperty("className",expect.stringContaining("foo"))`,
  ],
  invalid: [
    {
      code: `expect(screen.getByRole("button").className).toBe("foo")`,
      errors,
      output: `expect(screen.getByRole("button")).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(getByRole("button").className).toBe("foo")`,
      errors,
      output: `expect(getByRole("button")).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `expect(screen.getByRole("button").className).not.toBe("foo")`,
      errors,
      output: `expect(screen.getByRole("button")).not.toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).toHaveProperty("className", "foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = getByText("foo"); expect(el).toHaveProperty("className", "foo")`,
      errors,
      output: `const el = getByText("foo"); expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute("class", "foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute(\`class\`, "foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute("class", expect.stringContaining("bar"))`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("bar")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute(\`class\`, expect.stringContaining("bar"))`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("bar")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).not.toHaveProperty("className", "foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute("class", "foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.className).toContain("foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.className).not.toContain("foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass("foo")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.className).toBe("foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.className).toEqual("foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.className).toStrictEqual("foo")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.className).toEqual(expect.stringContaining("foo"))`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.className).toEqual(expect.stringContaining(\`foo\`))`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass(\`foo\`)`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.className).toStrictEqual(expect.stringContaining("foo"))`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.className).toEqual(expect.stringContaining("bar"))`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("bar")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList).toContain("bar")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("bar")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList).toBe("bar")`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList[0]).toBe("bar")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("bar")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList[0]).not.toBe("bar")`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList["1"]).toBe("bar")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("bar")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList[i]).not.toBe("bar")`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList[0]).toContain(("fo"))`,
      errors,
    },

    {
      code: `const el = screen.getByText("foo"); expect(el.classList).toEqual(expect.objectContaining({0:"foo"}))`,
      errors,
    },

    {
      code: `const el = screen.getByText("foo"); expect(el.classList).toContain(className)`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass(className)`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList).toContain("className")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("className")`,
    },

    {
      code: `const el = screen.getByText("foo"); expect(el.classList).toContain(foo("bar"))`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass(foo("bar"))`,
    },

    {
      code: `const el = screen.getByText("foo"); expect(el.classList.contains("foo")).toBe(false)`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass("foo")`,
    },

    {
      code: `const el = screen.getByText("foo"); expect(el.classList.contains("foo")).toBe(true)`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.contains("foo")).toBeTruthy()`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.contains("foo")).toBeTrue()`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("foo")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.contains("foo")).toBeFalse()`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass("foo")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList).not.toContain("bar")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass("bar")`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList).not.toBe("bar")`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList[0]).not.toContain(("fo"))`,
      errors,
    },

    {
      code: `const el = screen.getByText("foo"); expect(el.classList).not.toEqual(expect.objectContaining({0:"foo"}))`,
      errors,
    },

    {
      code: `const el = screen.getByText("foo"); expect(el.classList).not.toContain(className)`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass(className)`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList).not.toContain("className")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass("className")`,
    },

    {
      code: `const el = screen.getByText("foo"); expect(el.classList).not.toContain(foo("bar"))`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass(foo("bar"))`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe("bar")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("bar", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe("bar baz")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("bar baz", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toEqual('  bar\\tbaz  qux ')`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass('  bar\\tbaz  qux ', { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toStrictEqual("bar baz")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("bar baz", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).not.toBe("bar baz")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass("bar baz", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(screen.getByRole("button").classList.value).not.toEqual("bar")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(screen.getByRole("button")).not.toHaveClass("bar", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe("")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe("  ")`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass("  ", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toContain("bar")`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).not.toContain("bar")`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe(classNames)`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass(classNames, { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).not.toEqual(getClassNames())`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass(getClassNames(), { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe(\`bar \${baz}\`)`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass(\`bar \${baz}\`, { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toEqual(expect.stringContaining("bar"))`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).not.toStrictEqual(expect.not.stringMatching(/bar/))`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe(expect.any(String))`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe()`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe("bar", "baz")`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect((el).classList.value).toBe("bar")`,
      errors,
      output: `const el = screen.getByText("foo"); expect((el)).toHaveClass("bar", { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe(("bar"))`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).toHaveClass(("bar"), { exact: true })`,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).not.toBe("bar",)`,
      errors,
      output: `const el = screen.getByText("foo"); expect(el).not.toHaveClass("bar", { exact: true })`,
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).not.toBe(/bar/)`,
      errors,
    },
    {
      code: `const el = screen.getByText("foo"); expect(el.classList.value).toBe(null)`,
      errors,
    },
  ],
});
