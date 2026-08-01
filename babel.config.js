const semver = require("semver");
const pkg = require("./package.json");

const supportedNodeVersion = semver.minVersion(pkg.engines.node).version;

/** @type {import('@babel/core').TransformOptions} */
const config = {
  presets: [["@babel/preset-env", { targets: { node: supportedNodeVersion } }]],
  ignore: ["**/__tests__/**"],
};

module.exports = config;
