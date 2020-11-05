/*
 * @forgerock/javascript-sdk-ui
 *
 * boolean-renderer.test.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { AttributeInputCallback, CallbackType, FRStep } from '@forgerock/javascript-sdk';
import { ElementHandle } from 'puppeteer';
import data from '../server/data';
import { getElement, getInnerHtml, getProperty, isSubmitEnabled, setTree } from './helpers';

const testName = 'BooleanAttributeCallbackRenderer';

let actualLabel: ElementHandle<HTMLLabelElement>;
let actualCheckbox: ElementHandle<HTMLInputElement>;
let expectedLabelText: string;
let expectedChecked: boolean;

beforeAll(async () => {
  const step = new FRStep(data[testName]);
  const callbackType = CallbackType.BooleanAttributeInputCallback;
  const callback = step.getCallbackOfType<AttributeInputCallback<boolean>>(callbackType);
  expectedLabelText = callback.getPrompt();
  expectedChecked = callback.getInputValue() as boolean;

  await setTree(testName);

  actualLabel = await getElement<HTMLLabelElement>('.fr-callback-0 label');
  actualCheckbox = await getElement<HTMLInputElement>('.fr-callback-0 input[type=checkbox]');
});

describe(testName, () => {
  it('renders correctly', async () => {
    // Has the correct text
    const actualLabelText = await getInnerHtml(actualLabel);
    expect(actualLabelText).toBe(expectedLabelText);

    // Checkbox has correct default state
    const actualChecked = await getProperty<boolean>(actualCheckbox, 'checked');
    expect(actualChecked).toBe(expectedChecked);

    // Submit is enabled
    const actualSubmitEnabled = await isSubmitEnabled();
    expect(actualSubmitEnabled).toBe(true);
  });
});
