/*
 * @forgerock/javascript-sdk-ui
 *
 * template.test.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { replaceTokens } from './template';

describe('Template helper', () => {
  it('populates tokens correctly', () => {
    const template = 'My name is {FIRST_NAME} {LAST_NAME}';
    const data = { FIRST_NAME: 'John', LAST_NAME: 'Smith' };
    const expectedValue = `My name is ${data.FIRST_NAME} ${data.LAST_NAME}`;
    const actualValue = replaceTokens(template, data);
    expect(actualValue).toEqual(expectedValue);
  });
});
