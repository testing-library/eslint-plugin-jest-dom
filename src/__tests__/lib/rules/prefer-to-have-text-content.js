/* eslint-disable no-template-curly-in-string */
/**
 * @fileoverview Prefer toHaveTextContent over checking element.textContent
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { FlatCompatRuleTester as RuleTester } from '../../rule-tester';
import * as rule from "../../../rules/prefer-to-have-text-content";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("prefer-to-have-text-content", rule, {
  valid: [
    `expect().toBe(true)`,
    `expect(string).toBe("foo")`,
    `expect(element).toHaveTextContent("foo")`,
    `expect(container.lastNode).toBe("foo")`,
  ],

  invalid: [
    {
      code: 'expect(element.textContent).toBe("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(element).toHaveTextContent("foo")`,
    },
    {
      code: 'expect(element.textContent).not.toBe("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(element).not.toHaveTextContent("foo")`,
    },
    {
      code: 'expect(screen.getByText("foo").textContent).toBe("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(screen.getByText("foo")).toHaveTextContent("foo")`,
    },
    {
      code: 'expect(container.firstChild.textContent).toBe("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(container.firstChild).toHaveTextContent("foo")`,
    },
    {
      code: 'expect(element.textContent).toEqual("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(element).toHaveTextContent("foo")`,
    },
    {
      code: 'expect(element.textContent).toContain("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(element).toHaveTextContent(/foo/)`,
    },
    {
      code: 'expect(element.textContent).toContain("$42/month?")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: "expect(element).toHaveTextContent(/\\$42\\/month\\?/)",
    },
    {
      code: "expect(element.textContent).toContain(100)",
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(element).toHaveTextContent(/100/)`,
    },
    {
      code: 'expect(container.firstChild.textContent).toContain("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(container.firstChild).toHaveTextContent(/foo/)`,
    },
    {
      code: `expect(container.textContent).toContain(FOO.bar)`,
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(container).toHaveTextContent(new RegExp(FOO.bar))`,
    },
    {
      code: `expect(container.textContent).not.toContain(FOO.bar)`,
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(container).not.toHaveTextContent(new RegExp(FOO.bar))`,
    },
    {
      code: "expect(container.textContent).toContain(`${FOO.bar} baz`)",
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output:
        "expect(container).toHaveTextContent(new RegExp(`${FOO.bar} baz`))",
    },
    {
      code: `expect(container.textContent).toContain(bazify(FOO.bar))`,
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(container).toHaveTextContent(new RegExp(bazify(FOO.bar)))`,
    },
    {
      code: 'expect(element.textContent).toMatch("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(element).toHaveTextContent(/foo/)`,
    },
    {
      code: "expect(element.textContent).toMatch(/foo bar/)",
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: "expect(element).toHaveTextContent(/foo bar/)",
    },
    {
      code: "expect(element.textContent).not.toMatch(/foo bar/)",
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: "expect(element).not.toHaveTextContent(/foo bar/)",
    },
    {
      code: 'expect(element.textContent).not.toMatch("foo")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(element).not.toHaveTextContent(/foo/)`,
    },
    {
      code: 'expect(element.textContent).not.toMatch("$42/month?")',
      errors: [
        {
          message:
            "Use toHaveTextContent instead of asserting on DOM node attributes",
        },
      ],
      output: `expect(element).not.toHaveTextContent(/\\$42\\/month\\?/)`,
    },
  ],
});
