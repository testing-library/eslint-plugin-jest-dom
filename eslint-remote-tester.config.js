"use strict";

const parser = require("@typescript-eslint/parser");
const {
  getRepositories,
  getPathIgnorePattern,
} = require("eslint-remote-tester-repositories");
const plugin = require("./dist");

module.exports = {
  repositories: getRepositories({ randomize: true }),
  pathIgnorePattern: getPathIgnorePattern(),
  extensions: ["js", "jsx", "ts", "tsx"],
  concurrentTasks: 3,
  cache: false,
  logLevel: "info",
  eslintConfig: [
    plugin.configs["flat/all"], //
    { languageOptions: { parser } },
  ],
};
