/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  snapshotSerializers: [
    require.resolve("jest-serializer-path"),
    require.resolve("jest-snapshot-serializer-raw/always"),
  ],
  // todo: this can go once we switch to using babel directly
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "kcd-scripts/dist/config/babel-transform",
  },
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/__fixtures__/*"],
};

module.exports = config;
