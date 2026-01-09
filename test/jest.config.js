module.exports = {
    testEnvironment: 'node',
    verbose: true,
    roots: ['<rootDir>'],
    // Setup global variables if needed
    globalSetup: '<rootDir>/jest.setup.js',
    testMatch: ['**/*.test.js'],
    testTimeout: 30000,
};
