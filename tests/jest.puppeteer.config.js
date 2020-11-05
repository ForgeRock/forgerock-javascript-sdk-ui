/*
 * @forgerock/javascript-sdk-ui
 *
 * jest.puppeteer.config.js
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

module.exports = {
  launch: {
    args: ['--incognito', '--ignore-certificate-errors'],
    // headless: false,
    // slowMo: 3000,
  },
  server: {
    command: 'npm run build:e2e & npm run start:e2e',
    port: 8443,
  },
};
