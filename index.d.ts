import { type Linter, type Rule } from "eslint";

declare const plugin: {
  meta: {
    name: string;
    version: string;
  };
  configs: {
    all: Linter.LegacyConfig;
    recommended: Linter.LegacyConfig;
    "flat/all": Linter.FlatConfig;
    "flat/recommended": Linter.FlatConfig;
  };
  rules: {
    [key: string]: Rule.RuleModule;
  };
};

export = plugin;
