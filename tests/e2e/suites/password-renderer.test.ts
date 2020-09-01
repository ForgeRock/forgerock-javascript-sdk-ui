/*
 * @forgerock/javascript-sdk-ui
 *
 * password-renderer.test.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { CallbackType, FRStep, ValidatedCreatePasswordCallback } from '@forgerock/javascript-sdk';
import { ElementHandle } from 'puppeteer';
import data from '../server/data';
import { getElement, getInnerHtml, getProperty, isSubmitEnabled, setTree } from './helpers';

const testName = 'PasswordCallbackRenderer';

let actualInput: ElementHandle<HTMLInputElement>;
let actualLabel: ElementHandle<HTMLLabelElement>;
let actualToggle: ElementHandle<HTMLButtonElement>;
let expectedLabelText: string;

beforeAll(async () => {
  const step = new FRStep(data[testName]);
  const callback = step.getCallbackOfType<ValidatedCreatePasswordCallback>(
    CallbackType.ValidatedCreatePasswordCallback,
  );
  expectedLabelText = callback.getPrompt();

  await setTree(testName);

  actualInput = await getElement<HTMLInputElement>('.fr-callback-0 input');
  actualLabel = await getElement<HTMLLabelElement>('.fr-callback-0 label');
  actualToggle = await getElement<HTMLButtonElement>('.fr-callback-0 button');
});

describe(testName, () => {
  it('renders correctly', async () => {
    // Starts as password type
    const actualInputType = await getProperty<string>(actualInput, 'type');
    expect(actualInputType).toBe('password');

    // Has the correct label
    const actualLabelText = await getInnerHtml(actualLabel);
    expect(actualLabelText).toBe(expectedLabelText);

    // Submit is disabled
    const actualSubmitEnabled = await isSubmitEnabled();
    expect(actualSubmitEnabled).toBe(false);
  });

  it('toggles password visibility correctly', async () => {
    // Show password
    await actualToggle.click();
    let actualInputType = await getProperty<string>(actualInput, 'type');
    expect(actualInputType).toBe('text');

    // Hide password
    await actualToggle.click();
    actualInputType = await getProperty<string>(actualInput, 'type');
    expect(actualInputType).toBe('password');
  });

  it('enables submit button when it has a value', async () => {
    // Disabled with no input
    let actualSubmitEnabled = await isSubmitEnabled();
    expect(actualSubmitEnabled).toBe(false);

    // Enabled with a single character
    await actualInput.type('X');
    actualSubmitEnabled = await isSubmitEnabled();
    expect(actualSubmitEnabled).toBe(true);

    // Disabled when input is cleared
    await actualInput.press('Backspace');
    actualSubmitEnabled = await isSubmitEnabled();
    expect(actualSubmitEnabled).toBe(false);
  });
});
