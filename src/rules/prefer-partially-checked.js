/**
 * @fileoverview prefer toBePartiallyChecked over checking aria-checked for mixed state
 */

import createPartiallyBannedAttributeRule from "../createPartiallyBannedAttributeRule";

export const meta = {
  docs: {
    description:
      "prefer toBePartiallyChecked over checking aria-checked attribute for mixed state",
    category: "Best Practices",
    recommended: false,
    url: "prefer-partially-checked",
  },
  fixable: "code",
};

export const create = createPartiallyBannedAttributeRule({
  preferred: "toBePartiallyChecked",
  attribute: "aria-checked",
});
