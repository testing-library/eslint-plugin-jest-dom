/* eslint-disable no-template-curly-in-string */
/**
 * @fileoverview Prefer toBeInTheDocument over querying and asserting length.
 * @author Anton Niklasson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import * as rule from "../../../rules/prefer-in-document";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const queryStrats = [
  "ByLabelText",
  "ByPlaceholderText",
  "ByText",
  "ByAltText",
  "ByTitle",
  "ByDisplayValue",
  "ByRole",
  "ByTestId",
];
const queries = [
  "get",
  "getAll",
  "query",
  "queryAll",
  "find",
  "findAll",
].reduce((acc, q) => {
  return [...acc, ...queryStrats.map((qs) => q + qs)];
}, []);

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run("prefer-in-document", rule, {
  valid: [
    ...queries.map((q) => `expect(screen.${q}('foo')).toBeInTheDocument()`),
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
    ...queries.map((q) => ({
      code: `expect(screen.${q}('foo')).toHaveLength(1)`,
      errors: [
        {
          messageId: "useDocument",
        },
      ],
    })),
  ],
});
