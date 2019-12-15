/**
 * @fileoverview prefer toHaveFocus over checking document.activeElement
 * @author Ben Monro
 */
'use strict';

let rule = require('../../../lib/rules/prefer-focus'),
  RuleTester = require('eslint').RuleTester;

let ruleTester = new RuleTester();
ruleTester.run('prefer-focus', rule, {
  valid: [
    `expect(document.activeElement).toBeNull()`,
    `expect(document.activeElement).not.toBeNull()`,
  ],

  invalid: [
    {
      code: 'expect(document.activeElement).toBe(foo)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).toHaveFocus()',
    },
    {
      code: 'expect(document.activeElement).not.toBe(foo)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).not.toHaveFocus()',
    },
    {
      code: 'expect(foo).not.toBe(document.activeElement)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).not.toHaveFocus()',
    },
    {
      code: 'expect(window.document.activeElement).toBe(foo)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).toHaveFocus()',
    },
    {
      code: 'expect(global.window.document.activeElement).toBe(foo)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).toHaveFocus()',
    },
    {
      code: 'expect(global.document.activeElement).toBe(foo)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).toHaveFocus()',
    },
    {
      code: 'expect(foo).toBe(global.document.activeElement)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).toHaveFocus()',
    },
    {
      code: 'expect(foo).toBe(window.document.activeElement)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).toHaveFocus()',
    },

    {
      code: 'expect(foo).toBe(global.window.document.activeElement)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).toHaveFocus()',
    },
    {
      code: 'expect(foo).toBe(document.activeElement)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).toHaveFocus()',
    },

    {
      code: 'expect(foo).toEqual(document.activeElement)',
      errors: [
        {
          message: 'Use toHaveFocus instead of checking activeElement',
        },
      ],
      output: 'expect(foo).toHaveFocus()',
    },
  ],
});
