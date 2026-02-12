/**
 * @fileoverview lint rules for use with jest-dom
 * @author Ben Monro
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import requireIndex from "requireindex";
import {
  name as packageName,
  version as packageVersion,
} from "../package.json";

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in src/rules and re-export them for .eslintrc configs
export const rules = requireIndex(`${__dirname}/rules`);

const allRules = Object.entries(rules).reduce(
  (memo, [name]) => ({
    ...memo,
    ...{ [`jest-dom/${name}`]: "error" },
  }),
  {}
);

const newRules = [
  "jest-dom/prefer-pressed",
  "jest-dom/prefer-partially-pressed",
  "jest-dom/prefer-partially-checked",
];

const recommendedRules = Object.fromEntries(
  Object.entries(allRules).filter(([name]) => !newRules.includes(name))
);

const plugin = {
  meta: {
    name: packageName,
    version: packageVersion,
  },
  configs: {
    recommended: {
      plugins: ["jest-dom"],
      rules: recommendedRules,
    },
    all: {
      plugins: ["jest-dom"],
      rules: allRules,
    },
  },
  rules,
};

plugin.configs["flat/recommended"] = {
  plugins: { "jest-dom": plugin },
  rules: recommendedRules,
};
plugin.configs["flat/all"] = {
  plugins: { "jest-dom": plugin },
  rules: allRules,
};

export default plugin;

// explicitly export config to allow using this plugin in CJS-based
// eslint.config.js files without needing to deal with the .default
// and also retain backwards compatibility with `.eslintrc` configs
export const configs = plugin.configs;
