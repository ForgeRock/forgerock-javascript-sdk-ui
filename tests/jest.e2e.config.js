/*
 * @forgerock/javascript-sdk-ui
 *
 * jest.e2e.config.js
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

const { collectCoverageFrom, globals, rootDir } = require('./jest.basic.config');
const tsPreset = require('ts-jest/jest-preset');
const puppeteerPreset = require('jest-puppeteer/jest-preset');

module.exports = {
  ...tsPreset,
  ...puppeteerPreset,
  collectCoverageFrom,
  globals,
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/e2e/**/*.test.ts'],
  rootDir,
};
