module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/tests/**'],
  coverageDirectory: 'coverage',
  verbose: true,
  maxWorkers: 1,
  globalTeardown: '<rootDir>/src/tests/globalTeardown.js'
};
