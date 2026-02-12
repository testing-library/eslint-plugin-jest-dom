/**
 * @fileoverview prefer toBePressed or not.toBePressed over attribute checks
 */

import createBannedAttributeRule from "../createBannedAttributeRule";

export const meta = {
  docs: {
    description: "prefer toBePressed over checking attributes",
    category: "Best Practices",
    recommended: false,
    url: "prefer-pressed",
  },
  fixable: "code",
};

export const create = createBannedAttributeRule({
  preferred: "toBePressed",
  negatedPreferred: "not.toBePressed",
  attributes: ["aria-pressed"],
  excludeValues: ["mixed"],
});
