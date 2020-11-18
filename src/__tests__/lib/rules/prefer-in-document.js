/* eslint-disable no-template-curly-in-string */
/**
 * @fileoverview Prefer toBeInTheDocument over querying and asserting length.
 * @author Anton Niklasson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import { queries } from "../../../queryNames";
import * as rule from "../../../rules/prefer-in-document";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("prefer-in-document", rule, {
  valid: [
    ...queries
      .map((q) => [
        `expect(screen.${q}('foo')).toBeInTheDocument()`,
        `expect(${q}('foo')).toBeInTheDocument()`,
        `expect(wrapper.${q}('foo')).toBeInTheDocument()`,
      ])
      .flat(),
    {
      code: `expect(screen.notAQuery('foo-bar')).toHaveLength(1)`,
      errors: [
        {
          messageId: "useDocument",
        },
      ],
    },
    {
      code: `expect(screen.getByText('foo-bar')).toHaveLength(2)`,
      errors: [
        {
          messageId: "useDocument",
        },
      ],
    },
  ],
  invalid: [
    ...queries
      .map((q) => [
        {
          code: `expect(screen.${q}('foo')).toHaveLength(1)`,
          errors: 1,
          output: `expect(screen.${q}('foo')).toBeInTheDocument()`,
        },
        {
          code: `expect(${q}('foo')).toHaveLength(1)`,
          errors: 1,
          output: `expect(${q}('foo')).toBeInTheDocument()`,
        },
        {
          code: `expect(wrapper.${q}('foo')).toHaveLength(1)`,
          errors: 1,
          output: `expect(wrapper.${q}('foo')).toBeInTheDocument()`,
        },
      ])
      .flat(),
  ],
});
