import { type Linter, type Rule } from "eslint";

type JestDomPluginConfigName = 'all' | 'recommended';

declare const plugin: {
  meta: {
    name: string;
    version: string;
  };
  configs: Record<JestDomPluginConfigName, Linter.LegacyConfig> &
    Record<`flat/${JestDomPluginConfigName}`, Linter.FlatConfig>;
  rules: Record<string, Rule.RuleModule>;
};

export = plugin;
