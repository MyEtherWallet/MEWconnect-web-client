module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/tests/**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/']
};
