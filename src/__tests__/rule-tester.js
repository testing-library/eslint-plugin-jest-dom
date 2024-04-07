import { RuleTester } from 'eslint';
import semver from 'semver';
import { version as eslintVersion } from 'eslint/package.json';

export const usingFlatConfig = semver.major(eslintVersion) >= 9;

export class FlatCompatRuleTester extends RuleTester {
  constructor(testerConfig) {
    super(FlatCompatRuleTester._flatCompat(testerConfig));
  }

  run(
    ruleName,
    rule,
    tests,
  ) {
    super.run(ruleName, rule, {
      valid: tests.valid.map(t => FlatCompatRuleTester._flatCompat(t)),
      invalid: tests.invalid.map(t => FlatCompatRuleTester._flatCompat(t)),
    });
  }

  static _flatCompat(config) {
    if (!config || !usingFlatConfig || typeof config === 'string') {
      return config;
    }

    const obj = {
      languageOptions: { parserOptions: {} },
    };

    for (const [key, value] of Object.entries(config)) {
      if (key === 'parser') {
        obj.languageOptions.parser = require(value);

        continue;
      }

      if (key === 'parserOptions') {
        for (const [option, val] of Object.entries(value)) {
          if (option === 'ecmaVersion' || option === 'sourceType') {
            obj.languageOptions[option] = val

            continue;
          }

          obj.languageOptions.parserOptions[option] = val;
        }

        continue;
      }

      obj[key] = value;
    }

    return obj;
  }
}
