/**
 * @fileoverview prefer toBeDisabled or toBeEnabled over attribute checks
 * @author Ben Monro
 */

import createBannedAttributeRule from "../createBannedAttributeRule";

export const meta = {
  docs: {
    description: "prefer toBeChecked over checking attributes",
    category: "Best Practices",
    recommended: true,
    url: "prefer-checked",
  },
  fixable: "code",
};

export const create = createBannedAttributeRule({
  preferred: "toBeChecked",
  negatedPreferred: "not.toBeChecked",
  attributes: ["checked", "aria-checked"],
  excludeValues: ["mixed"],
});
