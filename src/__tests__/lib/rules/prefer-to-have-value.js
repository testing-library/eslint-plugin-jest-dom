/* eslint-disable no-template-curly-in-string */
/**
 * @fileoverview Prefer toBeEmptyDOMElement over checking innerHTML
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import * as rule from "../../../rules/prefer-to-have-value";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });

const errors = [{ messageId: "use-to-have-value" }];
ruleTester.run("prefer-to-have-value", rule, {
  valid: [
    `expect(element).toHaveValue('foo')`,
    `expect(element.value).toBeGreaterThan(2);`,
    `expect(element.value).toBeLessThan(2);`,

    `const element = document.getElementById('asdfasf');
    expect(element.value).toEqual('foo');`,

    `let element;
    element = someOtherFunction();
    expect(element.value).toStrictEqual('foo');`,

    `const element = { value: 'foo' };
    expect(element.value).toBe('foo');`,

    `const element = document.getElementById('asdfasf');
    expect(element.value).not.toEqual('foo');`,

    `let element;
    element = someOtherFunction();
    expect(element.value).not.toStrictEqual('foo');`,

    `const element = { value: 'foo' };
    expect(element.value).not.toBe('foo');`,
  ],
  invalid: [
    {
      code: `expect(element).toHaveAttribute('value', 'foo')`,
      errors,
      output: `expect(element).toHaveValue('foo')`,
    },
    {
      code: `expect(element).toHaveProperty("value", "foo")`,
      errors,
      output: `expect(element).toHaveValue("foo")`,
    },
    {
      code: `expect(element).not.toHaveAttribute('value', 'foo')`,
      errors,
      output: `expect(element).not.toHaveValue('foo')`,
    },
    {
      code: `expect(element).not.toHaveProperty("value", "foo")`,
      errors,
      output: `expect(element).not.toHaveValue("foo")`,
    },
    //==========================================================================
    {
      code: `expect(screen.getByRole("textbox").value).toEqual("foo")`,
      errors,
      output: `expect(screen.getByRole("textbox")).toHaveValue("foo")`,
    },
    {
      code: `expect(screen.queryByRole("dropdown").value).toEqual("foo")`,
      errors,
      output: `expect(screen.queryByRole("dropdown")).toHaveValue("foo")`,
    },
    {
      code: `async function x() { expect((await screen.findByRole("textbox")).value).toEqual("foo") }`,
      errors,
      output: `async function x() { expect((await screen.findByRole("textbox"))).toHaveValue("foo") }`,
    },
    {
      code: `const element = screen.getByRole("textbox"); expect(element.value).toBe("foo");`,
      errors,
      output: `const element = screen.getByRole("textbox"); expect(element).toHaveValue("foo");`,
    },
    {
      code: `expect(screen.getByRole("textbox").value).not.toEqual("foo")`,
      errors,
      output: `expect(screen.getByRole("textbox")).not.toHaveValue("foo")`,
    },
    {
      code: `expect(screen.queryByRole("dropdown").value).not.toEqual("foo")`,
      errors,
      output: `expect(screen.queryByRole("dropdown")).not.toHaveValue("foo")`,
    },
    {
      code: `async function x() { expect((await screen.getByRole("textbox")).value).not.toEqual("foo") }`,
      errors,
      output: `async function x() { expect((await screen.getByRole("textbox"))).not.toHaveValue("foo") }`,
    },
    {
      code: `const element = screen.getByRole("textbox"); expect(element.value).not.toBe("foo");`,
      errors,
      output: `const element = screen.getByRole("textbox"); expect(element).not.toHaveValue("foo");`,
    },
    //==========================================================================
    {
      code: `expect(screen.getByTestId('bananas').value).toEqual('foo')`,
      errors: [
        {
          ...errors[0],
          suggestions: [
            {
              desc: "Replace toEqual with toHaveValue",
              output: `expect(screen.getByTestId('bananas')).toHaveValue('foo')`,
            },
          ],
        },
      ],
    },
    {
      code: `expect(screen.queryByTestId('bananas').value).toBe('foo')`,
      errors: [
        {
          ...errors[0],
          suggestions: [
            {
              desc: "Replace toBe with toHaveValue",
              output: `expect(screen.queryByTestId('bananas')).toHaveValue('foo')`,
            },
          ],
        },
      ],
    },
    {
      code: `async function x() { expect((await screen.findByTestId("bananas")).value).toStrictEqual("foo") }`,
      errors: [
        {
          ...errors[0],
          suggestions: [
            {
              desc: "Replace toStrictEqual with toHaveValue",
              output: `async function x() { expect((await screen.findByTestId("bananas"))).toHaveValue("foo") }`,
            },
          ],
        },
      ],
    },
    {
      code: `let element; element = screen.getByTestId('bananas'); expect(element.value).toEqual('foo');`,
      errors: [
        {
          ...errors[0],
          suggestions: [
            {
              desc: "Replace toEqual with toHaveValue",
              output: `let element; element = screen.getByTestId('bananas'); expect(element).toHaveValue('foo');`,
            },
          ],
        },
      ],
    },
    {
      code: `expect(screen.getByTestId('bananas').value).not.toEqual('foo')`,
      errors: [
        {
          ...errors[0],
          suggestions: [
            {
              desc: "Replace toEqual with toHaveValue",
              output: `expect(screen.getByTestId('bananas')).not.toHaveValue('foo')`,
            },
          ],
        },
      ],
    },
    {
      code: `expect(screen.queryByTestId('bananas').value).not.toBe('foo')`,
      errors: [
        {
          ...errors[0],
          suggestions: [
            {
              desc: "Replace toBe with toHaveValue",
              output: `expect(screen.queryByTestId('bananas')).not.toHaveValue('foo')`,
            },
          ],
        },
      ],
    },
    {
      code: `async function x() { expect((await screen.findByTestId("bananas")).value).not.toStrictEqual("foo") }`,
      errors: [
        {
          ...errors[0],
          suggestions: [
            {
              desc: "Replace toStrictEqual with toHaveValue",
              output: `async function x() { expect((await screen.findByTestId("bananas"))).not.toHaveValue("foo") }`,
            },
          ],
        },
      ],
    },
    {
      code: `let element; element = screen.getByTestId('bananas'); expect(element.value).not.toEqual('foo');`,
      errors: [
        {
          ...errors[0],
          suggestions: [
            {
              desc: "Replace toEqual with toHaveValue",
              output: `let element; element = screen.getByTestId('bananas'); expect(element).not.toHaveValue('foo');`,
            },
          ],
        },
      ],
    },
  ],
});
