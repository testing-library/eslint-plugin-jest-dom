const prettierConfig = require("kcd-scripts/prettier");

module.exports = {
  ...prettierConfig,
  arrowParens: "always",
  bracketSpacing: true,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
};
