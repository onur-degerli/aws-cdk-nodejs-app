module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/app', '<rootDir>/lib'],
  testMatch: ['**/lib/tests/**/*.spec.ts', '**/app/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
