/* eslint-disable no-template-curly-in-string */
/**
 * @fileoverview Prefer toBeInTheDocument over querying and asserting length.
 * @author Anton Niklasson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import { queries } from "@testing-library/dom";
import * as rule from "../../../rules/prefer-in-document";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("prefer-in-document", rule, {
  valid: [
    ...Object.keys(queries)
      .map((q) => [
        `expect(screen.${q}('foo')).toBeInTheDocument()`,
        `expect(${q}('foo')).toBeInTheDocument()`,
        `expect(wrapper.${q}('foo')).toBeInTheDocument()`,
      ])
      .flat(),
    `expect(screen.notAQuery('foo-bar')).toHaveLength(1)`,
    `expect(screen.getByText('foo-bar')).toHaveLength(2)`,
  ],
  invalid: [
    ...Object.keys(queries)
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
