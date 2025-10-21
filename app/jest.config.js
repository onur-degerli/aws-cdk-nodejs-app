const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  collectCoverage: true,
  coverageThreshold: {
    branches: 80,
    functions: 85,
    lines: 85,
    statements: 85,
  },
};
