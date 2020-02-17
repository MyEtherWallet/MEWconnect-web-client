module.exports = {
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  setTimeout: 10000,
  coverageDirectory: 'coverage',
  // testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/test/**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  "testEnvironment": "node",
  transform: {
    "^.+\\.(js) ? $": "babel-jest"
},
  "setupFiles": [
    "<rootDir>/test/jest.setup.js"
  ],
  "moduleNameMapper": {
    "@signals(.*)$": "<rootDir>/test/signals$1",
    "@clients(.*)$": "<rootDir>/test/clients$1",
    "@config(.*)$": "<rootDir>/test/config$1",
    "@utils(.*)$": "<rootDir>/test/utils$1",
    "@/(.*)$": "<rootDir>dist$1"
  }
};
