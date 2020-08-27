/*
 * @forgerock/javascript-sdk-ui
 *
 * kba-create-renderer.test.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { CallbackType, FRStep, KbaCreateCallback } from '@forgerock/javascript-sdk';
import { ElementHandle } from 'puppeteer';
import data from '../server/data';
import { getElements, getInnerHtml, hasClass, setDropdownValue, setTree } from './helpers';

const testName = 'KbaCreateCallbackRenderer';

let callbacks: KbaCreateCallback[];
let expectedLabelText: string;
let actualDropdowns: ElementHandle<HTMLSelectElement>[];

beforeAll(async () => {
  const step = new FRStep(data[testName]);
  callbacks = step.getCallbacksOfType<KbaCreateCallback>(CallbackType.KbaCreateCallback);
  expectedLabelText = callbacks[0].getPrompt();

  await setTree(testName);

  actualDropdowns = await getElements<HTMLSelectElement>('select');
});

describe(testName, () => {
  it('renders a dropdown for each callback', async () => {
    expect(actualDropdowns.length).toBe(callbacks.length);
  });

  it('renders only a single label', async () => {
    // Ensure the label only appears once and its text is correct.  There is
    // no negative test to ensure a label *isn't* rendered if a prompt isn't set.
    if (expectedLabelText) {
      const actualLabels = await getElements('.form-group p');
      expect(actualLabels.length).toBe(1);
      const actualLabelText = await getInnerHtml('.form-group p');
      expect(actualLabelText).toBe(expectedLabelText);
    }
  });

  it('renders and initializes dropdowns correctly', async () => {
    for (let i = 0; i < callbacks.length; i++) {
      // Ensure the right number of predefined questions are listed (options + 1 for "custom")
      const actualOptions = await actualDropdowns[i].$$('option');
      expect(actualOptions.length).toBe(callbacks[i].getPredefinedQuestions().length + 1);

      // Ensure the right question is pre-selected
      const dropdownValueProp = await actualDropdowns[i].getProperty('value');
      const dropdownValue = await dropdownValueProp.jsonValue();
      expect(dropdownValue).toBe(callbacks[i].getPredefinedQuestions()[i]);
    }
  });

  it('renders input boxes for the security answers', async () => {
    const actualAnswerInputs = await getElements('.fr-kba-answer');
    expect(actualAnswerInputs.length).toBe(callbacks.length);
  });

  it('correctly toggles an input box for custom question', async () => {
    const actualCustomWraps = await getElements('.fr-kba-custom-wrap');
    expect(actualCustomWraps.length).toBe(callbacks.length);
    for (let i = 0; i < callbacks.length; i++) {
      // Ensure the number of options equals the number of predefined questions plus "custom"
      const actualOptions = await actualDropdowns[i].$$('option');
      expect(actualOptions.length).toBe(callbacks.length + 1);

      // Ensure "custom" is initially hidden
      let isHidden = await hasClass(actualCustomWraps[i], 'd-none');
      expect(isHidden).toBe(true);

      // Ensure "custom" is visible when custom question is selected
      const customQuestion = await getInnerHtml(actualOptions[actualOptions.length - 1]);
      await setDropdownValue(actualDropdowns[i], customQuestion);
      isHidden = await hasClass(actualCustomWraps[i], 'd-none');
      expect(isHidden).toBe(false);

      // Ensure "custom" is hidden when custom question is not selected
      const firstQuestion = await getInnerHtml(actualOptions[0]);
      await setDropdownValue(actualDropdowns[i], firstQuestion);
      isHidden = await hasClass(actualCustomWraps[i], 'd-none');
      expect(isHidden).toBe(true);
    }
  });
});
