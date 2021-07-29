module.exports = {
    collectCoverageFrom: [
      '**/*.{ts,tsx}',
      '!**/node_modules/**',
      '!**/__tests__/**',
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
    setupFiles: [
      '<rootDir>/jest.setup.js',
    ],
    setupFilesAfterEnv: [
      '<rootDir>/jest.setupAfterEnv.js',
    ],
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    testEnvironment: 'jsdom',
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    }
  };