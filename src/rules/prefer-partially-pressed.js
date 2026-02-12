/**
 * @fileoverview prefer toBePartiallyPressed over checking aria-pressed for mixed state
 */

import createPartiallyBannedAttributeRule from "../createPartiallyBannedAttributeRule";

export const meta = {
  docs: {
    description:
      "prefer toBePartiallyPressed over checking aria-pressed attribute for mixed state",
    category: "Best Practices",
    recommended: false,
    url: "prefer-partially-pressed",
  },
  fixable: "code",
};

export const create = createPartiallyBannedAttributeRule({
  preferred: "toBePartiallyPressed",
  attribute: "aria-pressed",
});
