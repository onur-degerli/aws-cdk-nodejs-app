module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/infra/lib'],
  testMatch: ['**/infra/lib/tests/**/*.spec.ts', '**/src/apps/**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
