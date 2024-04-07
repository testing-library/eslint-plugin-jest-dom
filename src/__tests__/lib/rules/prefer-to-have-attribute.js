/* eslint-disable no-template-curly-in-string */
/**
 * @fileoverview prefer toHaveAttribute over checking  getAttribute/hasAttribute
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { FlatCompatRuleTester as RuleTester } from '../../rule-tester';
import * as rule from "../../../rules/prefer-to-have-attribute";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("prefer-to-have-attribute", rule, {
  valid: [
    "expect().toBe(true)",
    "expect(element.foo).toBeTruthy()",
    "expect(element.getAttributeNode()).toBeNull()",
    `expect(element.getAttribute('foo')).toBeGreaterThan(2)`,
    `expect(element.getAttribute('foo')).toBeLessThan(2)`,
  ],

  invalid: [
    {
      code: `expect(element.getAttribute('foo')).toMatch(/bar/);`,
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: `expect(element).toHaveAttribute('foo', expect.stringMatching(/bar/));`,
    },
    {
      code: `expect(element.getAttribute('foo')).toContain('bar');`,
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: `expect(element).toHaveAttribute('foo', expect.stringContaining('bar'));`,
    },
    {
      code: "expect(element.getAttribute('foo')).toContain(`bar=${encodeURIComponent(baz.id)}`);",
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output:
        "expect(element).toHaveAttribute('foo', expect.stringContaining(`bar=${encodeURIComponent(baz.id)}`));",
    },
    {
      code: 'expect(element.getAttribute("foo")).toBe("bar")',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: 'expect(element).toHaveAttribute("foo", "bar")',
    },
    {
      code: `expect(getByText("yes").getAttribute("data-blah")).toBe(expect.stringMatching(/foo/))`,
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: `expect(getByText("yes")).toHaveAttribute("data-blah", expect.stringMatching(/foo/))`,
    },
    {
      code: `expect(getByText("yes").getAttribute("data-blah")).toBe("")`,
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: `expect(getByText("yes")).toHaveAttribute("data-blah", "")`,
    },
    {
      code: `expect(getByText("yes").getAttribute("data-blah")).toBe('')`,
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: `expect(getByText("yes")).toHaveAttribute("data-blah", '')`,
    },
    {
      code: `expect(getByText('foo').hasAttribute('foo')).toBe(null)`,
      errors: [
        {
          message: "Invalid matcher for hasAttribute",
        },
      ],
      output: null,
    },
    {
      code: `expect(getByText('foo').hasAttribute('foo')).toBeNull()`,
      errors: [
        {
          message: "Invalid matcher for hasAttribute",
        },
      ],
      output: null,
    },
    {
      code: `expect(getByText('foo').getAttribute('foo')).toBeDefined()`,
      errors: [
        {
          message: "Invalid matcher for getAttribute",
        },
      ],
      output: null,
    },
    {
      code: `expect(getByText('foo').getAttribute('foo')).toBeUndefined()`,
      errors: [
        {
          message: "Invalid matcher for getAttribute",
        },
      ],
      output: null,
    },
    {
      code: `expect(getByText('foo').hasAttribute('foo')).toBeUndefined()`,
      errors: [
        {
          message: "Invalid matcher for hasAttribute",
        },
      ],
      output: null,
    },
    {
      code: 'expect(element.hasAttribute("foo")).toBeTruthy()',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on hasAttribute",
        },
      ],
      output: 'expect(element).toHaveAttribute("foo")',
    },
    {
      code: 'expect(element.hasAttribute("foo")).toBeFalsy()',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on hasAttribute",
        },
      ],
      output: 'expect(element).not.toHaveAttribute("foo")',
    },
    {
      code: 'expect(element.hasAttribute("foo")).toBe(true)',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on hasAttribute",
        },
      ],
      output: 'expect(element).toHaveAttribute("foo")',
    },
    {
      code: 'expect(element.hasAttribute("foo")).toBe(false)',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on hasAttribute",
        },
      ],
      output: 'expect(element).not.toHaveAttribute("foo")',
    },
    {
      code: 'expect(element.hasAttribute("foo")).toEqual(false)',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on hasAttribute",
        },
      ],
      output: 'expect(element).not.toHaveAttribute("foo")',
    },
    {
      code: 'expect(element.getAttribute("foo")).toEqual("bar")',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: 'expect(element).toHaveAttribute("foo", "bar")',
    },
    {
      code: `expect(getByText("yes").getAttribute("data-blah")).toEqual("")`,
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: `expect(getByText("yes")).toHaveAttribute("data-blah", "")`,
    },
    {
      code: `expect(getByText("yes").getAttribute("data-blah")).toEqual('')`,
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: `expect(getByText("yes")).toHaveAttribute("data-blah", '')`,
    },
    {
      code: 'expect(element.getAttribute("foo")).toStrictEqual("bar")',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: 'expect(element).toHaveAttribute("foo", "bar")',
    },
    {
      code: `expect(getByText("yes").getAttribute("data-blah")).toStrictEqual("")`,
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: `expect(getByText("yes")).toHaveAttribute("data-blah", "")`,
    },
    {
      code: `expect(getByText("yes").getAttribute("data-blah")).toStrictEqual('')`,
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: `expect(getByText("yes")).toHaveAttribute("data-blah", '')`,
    },
    {
      code: 'expect(element.getAttribute("foo")).toBe(null)',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: 'expect(element).not.toHaveAttribute("foo")',
    },
    {
      code: 'expect(element.getAttribute("foo")).toBeNull()',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: 'expect(element).not.toHaveAttribute("foo")',
    },
  ],
});
