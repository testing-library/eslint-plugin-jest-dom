/**
 * @fileoverview lint rules for use with jest-dom
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import requireIndex from "requireindex";

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in src/rules
export const rules = requireIndex(`${__dirname}/rules`);

export const generateRecommendedConfig = (allRules) =>
  Object.entries(allRules).reduce(
    (memo, [name, rule]) => ({
      ...memo,
      ...(rule.meta.docs.recommended ? { [`jest-dom/${name}`]: "error" } : {}),
    }),
    {}
  );

export const generateAllRulesConfig = (allRules) =>
  Object.entries(allRules).reduce(
    (memo, [name]) => ({
      ...memo,
      ...{ [`jest-dom/${name}`]: "error" },
    }),
    {}
  );

export const configs = {
  recommended: {
    plugins: ["jest-dom"],
    rules: generateRecommendedConfig(rules),
  },
  all: {
    plugins: ["jest-dom"],
    rules: generateAllRulesConfig(rules),
  },
};
