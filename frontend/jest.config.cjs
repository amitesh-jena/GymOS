/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.{ts,tsx}'
  ],
  setupFiles: ['<rootDir>/jest.polyfills.cjs'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx|js|mjs)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@mswjs|@open-draft|msw|rettime|until-async|outvariant|strict-event-emitter|headers-polyfill)/)'
  ],
};
