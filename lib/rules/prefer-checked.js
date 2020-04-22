/**
 * @fileoverview prefer toBeDisabled or toBeEnabled over attribute checks
 * @author Ben Monro
 */
"use strict";

const createBannedAttributeRule = require("../createBannedAttributeRule");

module.exports = {
  meta: {
    docs: {
      description: "prefer toBeChecked over checking attributes",
      category: "jest-dom",
      recommended: true,
      url: "prefer-checked"
    },
    fixable: "code"
  },

  create: createBannedAttributeRule({
    preferred: "toBeChecked",
    negatedPreferred: "not.toBeChecked",
    attributes: ["checked", "aria-checked"]
  })
};
