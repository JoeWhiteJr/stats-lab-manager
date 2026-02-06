module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/tests/setup.js'],
  testMatch: ['<rootDir>/src/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*.js', '!src/tests/**'],
  coverageDirectory: 'coverage',
  verbose: true,
  maxWorkers: 1,
  globalTeardown: '<rootDir>/src/tests/globalTeardown.js'
};
