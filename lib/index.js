/**
 * @fileoverview lint rules for use with jest-dom
 * @author Ben Monro
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + '/rules');

module.exports.generateRecommendedConfig = rules => {
  return Object.entries(rules).reduce(
    (memo, [name, rule]) =>
      rule.meta.docs.recommended ? { ...memo, [name]: 'error' } : memo,
    {}
  );
};

module.exports.configs = {
  recommended: {
    plugins: ['jest-dom'],
    rules: module.exports.generateRecommendedConfig(module.exports.rules),
  },
};
