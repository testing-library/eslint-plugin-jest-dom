/**
 * @fileoverview prefer toBeDisabled or toBeEnabled over attribute checks
 * @author Ben Monro
 */

import { FlatCompatRuleTester as RuleTester } from "../../rule-tester";
import createBannedAttributeTestCases from "../../__fixtures__/createBannedAttributeTestCases";

const bannedAttributes = [
  {
    preferred: "toBeDisabled()",
    negatedPreferred: "toBeEnabled()",
    attributes: ["disabled"],
    ruleName: "prefer-enabled-disabled",
  },
  {
    preferred: "toBeRequired()",
    negatedPreferred: "not.toBeRequired()",
    attributes: ["required", "aria-required"],
    ruleName: "prefer-required",
  },
  {
    preferred: "toBeChecked()",
    negatedPreferred: "not.toBeChecked()",
    mixedPreferred: "toBePartiallyChecked()",
    attributes: ["checked", "aria-checked"],
    ruleName: "prefer-checked",
  },
  {
    preferred: "toBePressed()",
    negatedPreferred: "not.toBePressed()",
    attributes: ["aria-pressed"],
    ruleName: "prefer-pressed",
  },
];

bannedAttributes.forEach(
  ({ preferred, negatedPreferred, mixedPreferred, attributes, ruleName }) => {
    const rule = require(`../../../rules/${ruleName}`);

    const ruleTester = new RuleTester({
      parserOptions: { ecmaVersion: 2015, sourceType: "module" },
    });
    attributes.forEach((attribute) => {
      ruleTester.run(
        ruleName,
        rule,
        createBannedAttributeTestCases({
          preferred,
          negatedPreferred,
          mixedPreferred,
          attribute,
        })
      );
    });
  }
);

// Test that excludeValues ("mixed") are not flagged by prefer-checked
const excludeValuesCases = [
  {
    ruleName: "prefer-pressed",
    attribute: "aria-pressed",
  },
];

excludeValuesCases.forEach(({ ruleName, attribute }) => {
  const rule = require(`../../../rules/${ruleName}`);
  const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2015, sourceType: "module" },
  });
  ruleTester.run(`${ruleName} (excludeValues: mixed)`, rule, {
    valid: [
      `const el = screen.getByText("foo"); expect(el).toHaveAttribute("${attribute}", "mixed")`,
      `const el = screen.getByText("foo"); expect(el).toHaveProperty("${attribute}", "mixed")`,
      `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute("${attribute}", "mixed")`,
      `const el = screen.getByText("foo"); expect(el).not.toHaveProperty("${attribute}", "mixed")`,
      `expect(getByText("foo")).toHaveAttribute("${attribute}", "mixed")`,
      `expect(getByText("foo")).not.toHaveAttribute("${attribute}", "mixed")`,
    ],
    invalid: [],
  });
});
