"use strict";

const { format } = require("prettier");
const prettierRC = require("./.prettierrc.js");

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  ignoreConfig: ["all", "flat/all", "flat/recommended"],
  postprocess: (doc) =>
    format(doc, {
      .../** @type {import('prettier').ResolveConfigOptions} */ (prettierRC),
      parser: "markdown",
    }),
};

module.exports = config;
