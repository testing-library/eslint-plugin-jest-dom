/**
 * @fileoverview Prefer toBeInTheDocument over querying and asserting length.
 * @author Anton Niklasson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import { queries, queriesByVariant } from "../../../queries";
import * as rule from "../../../rules/prefer-in-document";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

function invalidCase(code, output) {
  return {
    code,
    output,
    errors: [
      {
        messageId: "use-document",
      },
    ],
  };
}

const valid = [
  ...queries.map((q) => [
    `expect(screen.${q}('foo')).toBeInTheDocument()`,
    `expect(${q}('foo')).toBeInTheDocument()`,
    `expect(wrapper.${q}('foo')).toBeInTheDocument()`,
  ]),
  `expect(screen.notAQuery('foo-bar')).toHaveLength(1)`,
  `expect(screen.getByText('foo-bar')).toHaveLength(2)`,
  `const element = screen.findByText('lorem ipsum'); expect(element).toBeDefined();`,
];
const invalid = [
  // Invalid cases that applies to all variants
  ...queries.map((q) => [
    invalidCase(
      `expect(screen.${q}('foo')).toHaveLength(1)`,
      `expect(screen.${q}('foo')).toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')).toHaveLength(1)`,
      `expect(${q}('foo')).toBeInTheDocument()`
    ),
    invalidCase(
      `expect(wrapper.${q}('foo')).toHaveLength(1)`,
      `expect(wrapper.${q}('foo')).toBeInTheDocument()`
    ),
  ]),
  // Invalid cases that applies to queryBy* and queryAllBy*
  ...queriesByVariant.query.map((q) => [
    invalidCase(
      `expect(${q}('foo')).toHaveLength(0)`,
      `expect(${q}('foo')).not.toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')).toBeNull()`,
      `expect(${q}('foo')).not.toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')).not.toBeNull()`,
      `expect(${q}('foo')).toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')).toBeDefined()`,
      `expect(${q}('foo')).toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')).not.toBeDefined()`,
      `expect(${q}('foo')).not.toBeInTheDocument()`
    ),
  ]),
];

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("prefer-in-document", rule, {
  valid: [].concat(...valid),
  invalid: [].concat(...invalid),
});
