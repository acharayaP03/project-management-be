import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
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
};

export default config;
