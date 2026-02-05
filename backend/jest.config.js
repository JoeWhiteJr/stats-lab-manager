module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/tests/**'],
  coverageDirectory: 'coverage',
  verbose: true,
  runInBand: true,
  globalTeardown: '<rootDir>/src/tests/globalTeardown.js'
};
