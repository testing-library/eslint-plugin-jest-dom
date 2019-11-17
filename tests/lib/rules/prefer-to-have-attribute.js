/**
 * @fileoverview prefer toHaveAttribute over checking  getAttribute/hasAttribute
 * @author Ben Monro
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require('../../../lib/rules/prefer-to-have-attribute'),
    RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester();
ruleTester.run('prefer-to-have-attribute', rule, {
    valid: [
        'expect(element.foo).toBeTruthy()',
        'expect(element.getAttributeNode()).toBeNull()'
    ],

    invalid: [
        {
            code: 'expect(element.getAttribute("foo")).toBe("bar")',
            errors: [
                {
                    message: 'Use toHaveAttribute instead of asserting on getAttribute',
                },
            ],
            output: 'expect(element).toHaveAttribute("foo", "bar")',
        },
        {
            code: 'expect(element.hasAttribute("foo")).toBeTruthy()',
            errors: [
                {
                    message: 'Use toHaveAttribute instead of asserting on hasAttribute',
                },
            ],
            output: 'expect(element).toHaveAttribute("foo")',
        },
        {
            code: 'expect(element.hasAttribute("foo")).toBe(true)',
            errors: [
                {
                    message: 'Use toHaveAttribute instead of asserting on hasAttribute',
                },
            ],
            output: 'expect(element).toHaveAttribute("foo")',
        },
        {
            code: 'expect(element.hasAttribute("foo")).toBe(false)',
            errors: [
                {
                    message: 'Use toHaveAttribute instead of asserting on hasAttribute',
                },
            ],
            output: 'expect(element).not.toHaveAttribute("foo")',
        }
    ],
});
