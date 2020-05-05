/**
 * @fileoverview prefer toBeDisabled or toBeEnabled over attribute checks
 * @author Ben Monro
 */

const createBannedAttributeRule = require("../createBannedAttributeRule");

module.exports = {
  meta: {
    docs: {
      description: "prefer toBeRequired over checking properties",
      category: "jest-dom",
      recommended: true,
      url: "prefer-required",
    },
    fixable: "code",
  },

  create: createBannedAttributeRule({
    preferred: "toBeRequired",
    negatedPreferred: "not.toBeRequired",
    attributes: ["required", "aria-required"],
  }),
};
