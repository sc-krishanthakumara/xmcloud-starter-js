const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/',
    '^components/(.*)$': '<rootDir>/src/components/',
    '^lib/(.*)$': '<rootDir>/src/lib/',
  },
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.[jt]s?(x)',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(?:@sitecore-content-sdk|@sitecore-feaas|lucide-react|change-case)/)',
  ],
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx,ts,tsx}',
    '!src/components/**/*.stories.{js,jsx,ts,tsx}',
    '!src/components/**/__tests__/**',
    '!src/**/*.d.ts',
  ],
};

module.exports = createJestConfig(customJestConfig);
