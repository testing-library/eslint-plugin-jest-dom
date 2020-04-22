/**
 * @fileoverview Prefer toHaveTextContent over checking element.textContent
 * @author Ben Monro
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/prefer-to-have-text-content"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester();
ruleTester.run("prefer-to-have-text-content", rule, {
  valid: [
    `expect(string).toBe("foo")`,
    `expect(element).toHaveTextContent("foo")`,
    `expect(container.lastNode).toBe("foo")`
  ],

  invalid: [
    {
      code: 'expect(element.textContent).toBe("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes"
        }
      ],
      output: `expect(element).toHaveTextContent("foo")`
    },
    {
      code: 'expect(element.textContent).not.toBe("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes"
        }
      ],
      output: `expect(element).not.toHaveTextContent("foo")`
    },
    {
      code: 'expect(screen.getByText("foo").textContent).toBe("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes"
        }
      ],
      output: `expect(screen.getByText("foo")).toHaveTextContent("foo")`
    },
    {
      code: 'expect(container.firstChild.textContent).toBe("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes"
        }
      ],
      output: `expect(container.firstChild).toHaveTextContent("foo")`
    },
    {
      code: 'expect(element.textContent).toEqual("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes"
        }
      ],
      output: `expect(element).toHaveTextContent("foo")`
    },
    {
      code: 'expect(element.textContent).toContain("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes"
        }
      ],
      output: `expect(element).toHaveTextContent(/foo/)`
    },
    {
      code: 'expect(container.firstChild.textContent).toContain("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes"
        }
      ],
      output: `expect(container.firstChild).toHaveTextContent(/foo/)`
    },
    {
      code: 'expect(element.textContent).toMatch("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes"
        }
      ],
      output: `expect(element).toHaveTextContent(/foo/)`
    },
    {
      code: 'expect(element.textContent).not.toMatch("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes"
        }
      ],
      output: `expect(element).not.toHaveTextContent(/foo/)`
    }
  ]
});
