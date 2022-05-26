import { RuleTester } from "eslint";
import * as rule from "../../../rules/prefer-to-have-style";

const errors = [
  { message: "Use toHaveStyle instead of asserting on element style" },
];
const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("prefer-to-have-style", rule, {
  valid: [
    `expect().toBe(true)`,
    `expect(el).toHaveStyle({foo:"bar"})`,
    `expect(el.style).toMatchSnapshot()`,
    `expect(el.style).toEqual(1)`,
    `expect(el.style).toEqual(foo)`,
    `expect(el.style[1]).toEqual([])`,
    `expect(el.style[1]).toEqual({})`,
    `expect(element.style[0]).toBe(new RegExp('reg'));`,
    `expect(el).toHaveAttribute("style")`,
    `React.useLayoutEffect(() => {
      if (foo) {
        document.body.setAttribute("style", "foo");
      }
    }, [foo]);`,
    `expect(collapse.style).not.toContain(
      expect.objectContaining({
        display: 'none',
        height: '0px',
      })
    )`,
  ],
  invalid: [
    {
      code: `expect(a.style).toHaveProperty('transform')`,
      errors,
    },
    {
      code: `expect(a.style).not.toHaveProperty('transform')`,
      errors,
    },
    {
      code: `expect(a.style).not.toHaveProperty(\`\${foo}\`)`,
      errors,
    },
    {
      code: `expect(el.style.foo).toBe("bar")`,
      errors,
      output: `expect(el).toHaveStyle({foo:"bar"})`,
    },
    {
      code: `expect(el.style.foo).not.toBe("bar")`,
      errors,
      output: `expect(el).not.toHaveStyle({foo:"bar"})`,
    },
    {
      code: "expect(el.style.backgroundImage).toBe(`url(${foo})`)",
      errors,
      output: "expect(el).toHaveStyle({backgroundImage:`url(${foo})`})",
    },
    {
      code: "expect(el.style.backgroundImage).not.toBe(`url(${foo})`)",
      errors,
      output: "expect(el).not.toHaveStyle({backgroundImage:`url(${foo})`})",
    },
    {
      code: `expect(el.style).toHaveProperty("background-color", "green")`,
      errors,
      output: `expect(el).toHaveStyle({backgroundColor: "green"})`,
    },
    {
      code: `expect(el.style).not.toHaveProperty("background-color", "green")`,
      errors,
      output: `expect(el).not.toHaveStyle({backgroundColor: "green"})`,
    },
    {
      code: `expect(screen.getByTestId("foo").style["scroll-snap-type"]).toBe("x mandatory")`,
      errors,
      output: `expect(screen.getByTestId("foo")).toHaveStyle({scrollSnapType: "x mandatory"})`,
    },
    {
      code: 'expect(el.style["scroll-snap-type"]).toBe(`${x} mandatory`)',
      errors,
      output: "expect(el).toHaveStyle({scrollSnapType: `${x} mandatory`})",
    },
    {
      code: `expect(el.style["scroll-snap-type"]).not.toBe("x mandatory")`,
      errors,
      output: `expect(el).not.toHaveStyle({scrollSnapType: "x mandatory"})`,
    },
    {
      code: `expect(el.style).toContain("background-color")`,
      errors,
      output: `expect(el).toHaveStyle({backgroundColor: expect.anything()})`,
    },
    {
      code: `expect(el.style).toContain(\`background-color\`)`,
      errors,
      output: `expect(el).toHaveStyle(\`background-color\`)`,
    },
    {
      code: `expect(el.style).not.toContain(\`background-color\`)`,
      errors,
      output: `expect(el).not.toHaveStyle(\`background-color\`)`,
    },
    {
      code: `expect(el.style).not.toContain("background-color")`,
      errors,
      output: `expect(el).not.toHaveStyle({backgroundColor: expect.anything()})`,
    },
    {
      code: `expect(el).toHaveAttribute("style", "background-color: green; border-width: 10px; color: blue;")`,
      errors,
      output: `expect(el).toHaveStyle("background-color: green; border-width: 10px; color: blue;")`,
    },
    {
      code: `expect(imageElement.style[\`box-shadow\`]).toBe(\`inset 0px 0px 0px 400px \${c}\`)`,
      errors,
      output: `expect(imageElement).toHaveStyle(\`box-shadow: inset 0px 0px 0px 400px \${c}\`)`,
    },
    {
      code: `expect(imageElement.style[\`box-shadow\`  ]).toBe(  \`inset 0px 0px 0px 400px \${c}\`)`,
      errors,
      output: `expect(imageElement).toHaveStyle(  \`box-shadow: inset 0px 0px 0px 400px \${c}\`)`,
    },
    {
      code: `expect(imageElement.style[\`box-\${shadow}\`]).toBe("inset 0px 0px 0px 400px 40px")`,
      errors,
      output: `expect(imageElement).toHaveStyle(\`box-\${shadow}: inset 0px 0px 0px 400px 40px\`)`,
    },
    {
      code: `expect(imageElement.style[\`box-shadow\`]).not.toBe(\`inset 0px 0px 0px 400px \${c}\`)`,
      errors,
      output: `expect(imageElement).not.toHaveStyle(\`box-shadow: inset 0px 0px 0px 400px \${c}\`)`,
    },
    {
      code: `expect(imageElement.style[\`box-shadow\`]).not.toBe("inset 0px 0px 0px 400px 40px")`,
      errors,
      output: `expect(imageElement).not.toHaveStyle(\`box-shadow: inset 0px 0px 0px 400px 40px\`)`,
    },
    {
      code: `expect(element.style[1]).toEqual('padding');`,
      errors,
      output: `expect(element).toHaveStyle({padding: expect.anything()});`,
    },
    {
      code: `expect(element.style[1]).toBe(\`padding\`);`,
      errors,
      output: `expect(element).toHaveStyle({[\`padding\`]: expect.anything()});`,
    },
    {
      code: `expect(element.style[1]).not.toEqual('padding');`,
      errors,
    },
    {
      code: `expect(element.style[1]).not.toBe(\`padding\`);`,
      errors,
    },
    {
      code: `expect(element.style[1]).toBe(x);`,
      errors,
      output: `expect(element).toHaveStyle({[x]: expect.anything()});`,
    },
    {
      code: `expect(element.style[0]).toBe(1);`,
      errors,
    },
    {
      code: `expect(element.style[0]).toBe(/RegExp/);`,
      errors,
    },
  ],
});
