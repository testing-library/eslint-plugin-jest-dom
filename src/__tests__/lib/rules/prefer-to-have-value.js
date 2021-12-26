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
    `expect(screen.getByRole("radio").value).toEqual("foo")`,
    `expect(screen.queryAllByRole("checkbox")[0].value).toStrictEqual("foo")`,
    `async function x() { expect((await screen.findByRole("button")).value).toBe("foo") }`,

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

    `expect(screen.getByRole("radio").value).not.toEqual("foo")`,
    `expect(screen.queryAllByRole("checkbox")[0].value).not.toStrictEqual("foo")`,
    `async function x() { expect((await screen.findByRole("button")).value).not.toBe("foo") }`,

    `const element = document.getElementById('asdfasf');
    expect(element.value).not.toEqual('foo');`,

    `let element;
    element = someOtherFunction();
    expect(element.value).not.toStrictEqual('foo');`,

    `const element = { value: 'foo' };
    expect(element.value).not.toBe('foo');`,
    `
      const res = makePath()();
      expect(res.value).toEqual('/repositories/create');
    `,
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
  ],
});
