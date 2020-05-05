/**
 * @fileoverview lint rules for use with jest-dom
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in src/rules
module.exports.rules = requireIndex(`${__dirname}/rules`);

module.exports.generateRecommendedConfig = (rules) => {
  return Object.entries(rules).reduce(
    (memo, [name, rule]) =>
      rule.meta.docs.recommended
        ? { ...memo, [`jest-dom/${name}`]: "error" }
        : memo,
    {}
  );
};

module.exports.configs = {
  recommended: {
    plugins: ["jest-dom"],
    rules: module.exports.generateRecommendedConfig(module.exports.rules),
  },
};
