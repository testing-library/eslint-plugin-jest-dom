/**
 * @fileoverview prefer toBeDisabled or toBeEnabled over attribute checks
 * @author Ben Monro
 */

import createBannedAttributeRule from "../createBannedAttributeRule";

export const meta = {
  docs: {
    description: "prefer toBeRequired over checking properties",
    category: "jest-dom",
    recommended: true,
    url: "prefer-required",
  },
  fixable: "code",
};

export const create = createBannedAttributeRule({
  preferred: "toBeRequired",
  negatedPreferred: "not.toBeRequired",
  attributes: ["required", "aria-required"],
});
