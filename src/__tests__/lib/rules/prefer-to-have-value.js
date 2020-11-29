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

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

const errors = [
    { messageId: "use-to-have-value" },
];
ruleTester.run("prefer-empty", rule, {
    valid: [`expect(element).toHaveValue('foo')`],
    invalid: [
        {
            code: `expect(element).toHaveAttribute('value', 'foo')`,
            errors,
            output: `expect(element).toHaveValue('foo')`
        },
        {
            code: `expect(element).toHaveProperty("value", "foo")`,
            errors,
            output: `expect(element).toHaveValue("foo")`
        },
        {
            code: `expect(element).not.toHaveAttribute('value', 'foo')`,
            errors,
            output: `expect(element).not.toHaveValue('foo')`
        },
        {
            code: `expect(element).not.toHaveProperty("value", "foo")`,
            errors,
            output: `expect(element).not.toHaveValue("foo")`
        },
        {
            code: `expect(element.value).toBe('foo')`,
            errors,
            output: `expect(element).toHaveValue('foo')`
        },
        {
            code: `expect(element.value).toEqual('foo')`,
            errors,
            output: `expect(element).toHaveValue('foo')`
        },
        {
            code: `expect(element.value).toStrictEqual('foo')`,
            errors,
            output: `expect(element).toHaveValue('foo')`
        },
        {
            code: `expect(element.value).not.toBe('foo')`,
            errors,
            output: `expect(element).not.toHaveValue('foo')`
        },
        {
            code: `expect(element.value).not.toEqual('foo')`,
            errors,
            output: `expect(element).not.toHaveValue('foo')`
        },
        {
            code: `expect(element.value).not.toStrictEqual('foo')`,
            errors,
            output: `expect(element).not.toHaveValue('foo')`
        },
    ]
});
