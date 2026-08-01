"use strict";

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
  snapshotSerializers: [require.resolve("jest-snapshot-serializer-raw/always")],
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/__fixtures__/*"],
};

module.exports = config;
