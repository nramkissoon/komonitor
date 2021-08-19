module.exports = {
    collectCoverageFrom: [
      '**/*.{ts,tsx}',
      '!**/node_modules/**',
      '!**/tests/**',
      '!**/coverage/**',
      '!jest.config.js',
    ],
    coverageThreshold: {
      global: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    testEnvironment: 'jsdom',
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "./node_modules/babel-jest"
    },
    roots: ["./packages"]
  };