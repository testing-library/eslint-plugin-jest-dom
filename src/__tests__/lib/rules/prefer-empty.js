/**
 * @fileoverview Prefer toBeEmptyDOMElement over checking innerHTML
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import * as rule from "../../../rules/prefer-empty";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("prefer-empty", rule, {
  valid: [
    `expect(element.innerHTML).toBe('foo')`,
    `expect(element.innerHTML).toBe(foo)`,
    `expect(element.innerHTML).not.toBe('foo')`,
    `expect(element.firstChild).toBe('foo')`,
    `expect(element.firstChild).not.toBe('foo')`,
    `expect(getByText("foo").innerHTML).toBe('foo')`,
    `expect(getByText("foo").innerHTML).not.toBe('foo')`,
    `expect(getByText("foo").firstChild).toBe('foo')`,
    `expect(getByText("foo").firstChild).not.toBe('foo')`,
    `expect(element.innerHTML === 'foo').toBe(true)`,
    `expect(element.innerHTML !== 'foo').toBe(true)`,
  ],

  invalid: [
    {
      code: `expect(element.innerHTML === '').toBe(true)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.innerHTML !== '').toBe(true)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).not.toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.innerHTML === '').toBe(false)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).not.toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.innerHTML !== '').toBe(false)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.firstChild === null).toBe(true)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.firstChild !== null).toBe(false)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.firstChild === null).toBe(false)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).not.toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.innerHTML).toBe('')`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).toBeEmptyDOMElement()`,
    },

    {
      code: `expect(element.innerHTML).toBe(null)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.innerHTML).not.toBe(null)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).not.toBeEmptyDOMElement()`,
    },

    {
      code: `expect(element.innerHTML).not.toBe('')`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).not.toBeEmptyDOMElement()`,
    },

    {
      code: `expect(element.firstChild).toBeNull()`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.firstChild).toBe(null)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).toBeEmptyDOMElement()`,
    },
    {
      code: `expect(element.firstChild).not.toBe(null)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).not.toBeEmptyDOMElement()`,
    },

    {
      code: `expect(element.firstChild).not.toBeNull()`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(element).not.toBeEmptyDOMElement()`,
    },
    {
      code: `expect(getByText('foo').innerHTML).toBe('')`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(getByText('foo')).toBeEmptyDOMElement()`,
    },

    {
      code: `expect(getByText('foo').innerHTML).toStrictEqual('')`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(getByText('foo')).toBeEmptyDOMElement()`,
    },

    {
      code: `expect(getByText('foo').innerHTML).toStrictEqual(null)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(getByText('foo')).toBeEmptyDOMElement()`,
    },

    {
      code: `expect(getByText('foo').firstChild).toBe(null)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(getByText('foo')).toBeEmptyDOMElement()`,
    },
    {
      code: `expect(getByText('foo').firstChild).not.toBe(null)`,
      errors: [
        {
          message: "Use toBeEmptyDOMElement instead of checking inner html.",
        },
      ],
      output: `expect(getByText('foo')).not.toBeEmptyDOMElement()`,
    },
  ],
});
