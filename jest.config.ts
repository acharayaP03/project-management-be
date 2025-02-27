/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  forceExit: true,
  verbose: true,
  clearMocks: true,
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  globalTeardown: './tests/teardown.ts',
  setupFilesAfterEnv: ['./tests/jest.setup.ts'],
  collectCoverage: true,

  // Add moduleNameMapper to help Jest resolve imports
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },
};
