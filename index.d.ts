import type { Linter, Rule } from "eslint";

type SupportedConfigs = 'all' | 'recommended';

declare const plugin: {
  meta: {
    name: string;
    version: string;
  };
  configs: Record<SupportedConfigs, Linter.LegacyConfig> &
    Record<`flat/${SupportedConfigs}`, Linter.FlatConfig>;
  rules: Record<string, Rule.RuleModule>;
};

export = plugin;
