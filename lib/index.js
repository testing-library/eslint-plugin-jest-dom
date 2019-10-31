/**
 * @fileoverview lint rules for use with jest-dom
 * @author Ben Monro
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let mapValues = require('lodash.mapvalues');
let requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + '/rules');

module.exports.configs = {
  recommended: {
    plugins: ['jest-dom'],
    rules: mapValues(module.exports.rules, () => 'error'),
  },
};
