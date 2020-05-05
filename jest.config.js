const jestConfig = require('kcd-scripts/jest')

module.exports = {
  ...jestConfig,
  coverageThreshold: {
    global: {
      branches: 96.55,
      functions: 100,
      lines: 98.97,
      statements: 0,
    },
  },
};
