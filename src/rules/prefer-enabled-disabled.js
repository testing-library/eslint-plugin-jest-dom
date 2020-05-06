/**
 * @fileoverview prefer toBeDisabled or toBeEnabled over attribute checks
 * @author Ben Monro
 */

const createBannedAttributeRule = require("../createBannedAttributeRule");

module.exports = {
  meta: {
    docs: {
      description:
        "prefer toBeDisabled or toBeEnabled over checking attributes",
      category: "jest-dom",
      recommended: true,
      url: "prefer-enabled-disabled",
    },
    fixable: "code",
  },

  create: createBannedAttributeRule({
    preferred: "toBeDisabled",
    negatedPreferred: "toBeEnabled",
    attributes: ["disabled"],
  }),
};
