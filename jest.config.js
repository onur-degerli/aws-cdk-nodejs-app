module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/app', '<rootDir>/infra/lib'],
  testMatch: ['**/infra/lib/tests/**/*.spec.ts', '**/app/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
