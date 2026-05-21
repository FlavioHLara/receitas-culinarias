/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/tests'],
    testMatch: ['**/*.spec.ts'],
    setupFiles: ['<rootDir>/src/tests/setup-env.ts'],
    clearMocks: true,
    verbose: true,
}
