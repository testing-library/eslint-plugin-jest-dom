import type { Linter, Rule } from "eslint";

type JestDomPluginConfig = 'all' | 'recommended';

declare const plugin: {
  meta: {
    name: string;
    version: string;
  };
  configs: Record<JestDomPluginConfig, Linter.LegacyConfig> &
    Record<`flat/${JestDomPluginConfig}`, Linter.FlatConfig>;
  rules: Record<string, Rule.RuleModule>;
};

export = plugin;
