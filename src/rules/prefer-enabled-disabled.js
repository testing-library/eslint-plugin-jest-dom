/**
 * @fileoverview prefer toBeDisabled or toBeEnabled over attribute checks
 * @author Ben Monro
 */

import createBannedAttributeRule from "../createBannedAttributeRule";

export const meta = {
  docs: {
    description: "prefer toBeDisabled or toBeEnabled over checking attributes",
    category: "jest-dom",
    recommended: true,
    url: "prefer-enabled-disabled",
  },
  fixable: "code",
};

export const create = createBannedAttributeRule({
  preferred: "toBeDisabled",
  negatedPreferred: "toBeEnabled",
  attributes: ["disabled"],
});
