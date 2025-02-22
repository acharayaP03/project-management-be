import { jest } from '@jest/globals';
beforeAll(() => {
    // Global setup code
});
afterEach(() => {
    // Clear all mocks and timers after each test
    jest.clearAllMocks();
    jest.clearAllTimers();
});
afterAll(() => {
    // Clean up after all tests in a file
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.restoreAllMocks();
    jest.resetModules();
});
//# sourceMappingURL=jest.setup.js.map