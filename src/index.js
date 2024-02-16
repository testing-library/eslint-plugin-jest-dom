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

// import all rules in src/rules
const rules = requireIndex(`${__dirname}/rules`);

const recommendedRules = Object.entries(rules).reduce(
  (memo, [name, rule]) => ({
    ...memo,
    ...(rule.meta.docs.recommended ? { [`jest-dom/${name}`]: "error" } : {}),
  }),
  {}
);

const allRules = Object.entries(rules).reduce(
  (memo, [name]) => ({
    ...memo,
    ...{ [`jest-dom/${name}`]: "error" },
  }),
  {}
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
