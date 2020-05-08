/**
 * @fileoverview prefer toHaveValue over checking the value attribute
 * @author Michaël De Boey
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import * as rule from "../../../rules/prefer-to-have-value";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new RuleTester().run("prefer-to-have-value", rule, {
  valid: [
    "expect(element.value).toBeTruthy()",
    "expect(element.getAttributeNode()).toBeNull()",
    `expect(element.getAttribute('value')).toBeGreaterThan(2)`,
    `expect(element.getAttribute('value')).toBeLessThan(2)`,
  ],

  invalid: [
    {
      code: `expect(element.getAttribute('value')).toMatch(/foo/);`,
      errors: [
        {
          message: "Use toHaveValue instead of asserting on getAttribute",
        },
      ],
      output: `expect(element).toHaveValue(expect.stringMatching(/foo/));`,
    },
    {
      code: `expect(element.getAttribute('value')).toContain('foo');`,
      errors: [
        {
          message: "Use toHaveValue instead of asserting on getAttribute",
        },
      ],
      output: `expect(element).toHaveValue(expect.stringContaining('foo'));`,
    },
    {
      code: 'expect(element.getAttribute("value")).toBe("foo")',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on getAttribute",
        },
      ],
      output: 'expect(element).toHaveValue("foo")',
    },
    {
      code: `expect(getByText("yes").getAttribute("value")).toBe(expect.stringMatching(/foo/))`,
      errors: [
        {
          message: "Use toHaveValue instead of asserting on getAttribute",
        },
      ],
      output: `expect(getByText("yes")).toHaveValue(expect.stringMatching(/foo/))`,
    },
    // {
    //   code: `expect(getByText('foo').hasAttribute('value')).toBe(null)`,
    //   errors: [
    //     {
    //       message: "Invalid matcher for hasAttribute",
    //     },
    //   ],
    //   output: null,
    // },
    // {
    //   code: `expect(getByText('foo').hasAttribute('value')).toBeNull()`,
    //   errors: [
    //     {
    //       message: "Invalid matcher for hasAttribute",
    //     },
    //   ],
    //   output: null,
    // },
    // {
    //   code: `expect(getByText('foo').getAttribute('value')).toBeDefined()`,
    //   errors: [
    //     {
    //       message: "Invalid matcher for getAttribute",
    //     },
    //   ],
    //   output: null,
    // },
    // {
    //   code: `expect(getByText('foo').getAttribute('value')).toBeUndefined()`,
    //   errors: [
    //     {
    //       message: "Invalid matcher for getAttribute",
    //     },
    //   ],
    //   output: null,
    // },
    // {
    //   code: `expect(getByText('foo').hasAttribute('value')).toBeUndefined()`,
    //   errors: [
    //     {
    //       message: "Invalid matcher for hasAttribute",
    //     },
    //   ],
    //   output: null,
    // },
    {
      code: 'expect(element.hasAttribute("value")).toBeTruthy()',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on hasAttribute",
        },
      ],
      output: "expect(element).toHaveValue()",
    },
    {
      code: 'expect(element.hasAttribute("value")).toBeFalsy()',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on hasAttribute",
        },
      ],
      output: "expect(element).not.toHaveValue()",
    },
    {
      code: 'expect(element.hasAttribute("value")).toBe(true)',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on hasAttribute",
        },
      ],
      output: "expect(element).toHaveValue()",
    },
    {
      code: 'expect(element.hasAttribute("value")).toBe(false)',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on hasAttribute",
        },
      ],
      output: "expect(element).not.toHaveValue()",
    },
    {
      code: 'expect(element.hasAttribute("value")).toEqual(false)',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on hasAttribute",
        },
      ],
      output: "expect(element).not.toHaveValue()",
    },
    {
      code: 'expect(element.getAttribute("value")).toEqual("foo")',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on getAttribute",
        },
      ],
      output: 'expect(element).toHaveValue("foo")',
    },
    {
      code: 'expect(element.getAttribute("value")).toStrictEqual("foo")',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on getAttribute",
        },
      ],
      output: 'expect(element).toHaveValue("foo")',
    },
    {
      code: 'expect(element.getAttribute("value")).toBe(null)',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on getAttribute",
        },
      ],
      output: "expect(element).not.toHaveValue()",
    },
    {
      code: 'expect(element.getAttribute("value")).toBeNull()',
      errors: [
        {
          message: "Use toHaveValue instead of asserting on getAttribute",
        },
      ],
      output: "expect(element).not.toHaveValue()",
    },
  ],
});
