const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ExperimentalWarning') ||
      args[0].includes('--experimental-vm-modules'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Set a longer timeout for tests if needed
// jest.setTimeout(30000);
//
