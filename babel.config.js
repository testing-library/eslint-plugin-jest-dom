const semver = require("semver");
const pkg = require("./package.json");

const supportedNodeVersion = semver.minVersion(pkg.engines.node).version;

/** @type {import('@babel/core').TransformOptions} */
const config = {
  presets: [
    [
      "@babel/preset-env",
      { targets: { node: supportedNodeVersion }, loose: true },
    ],
  ],
  ignore: process.env.NODE_ENV === "test" ? [] : ["**/__tests__/**"],
};

module.exports = config;
