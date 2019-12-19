const { collectCoverageFrom, globals } = require('./test-unit.config');
const tsPreset = require('ts-jest/jest-preset');
const puppeteerPreset = require('jest-puppeteer/jest-preset');

module.exports = {
  ...tsPreset,
  ...puppeteerPreset,
  collectCoverageFrom,
  globals,
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/e2e/**/*.test.ts',
  ],
};
