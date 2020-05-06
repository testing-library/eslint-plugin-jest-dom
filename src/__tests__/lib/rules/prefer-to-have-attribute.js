/**
 * @fileoverview prefer toHaveAttribute over checking  getAttribute/hasAttribute
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../rules/prefer-to-have-attribute");
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("prefer-to-have-attribute", rule, {
  valid: [
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
      code: 'expect(element.getAttribute("foo")).toStrictEqual("bar")',
      errors: [
        {
          message: "Use toHaveAttribute instead of asserting on getAttribute",
        },
      ],
      output: 'expect(element).toHaveAttribute("foo", "bar")',
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
