import { CallbackType, ConfirmationCallback, FRStep } from '@forgerock/javascript-sdk';
import { ElementHandle } from 'puppeteer';
import data from '../server/data';
import { getElement, getElements, getInnerHtml, setTree } from './helpers';

const testName = 'ConfirmationCallbackRenderer';

let actualLabel: ElementHandle<HTMLLabelElement> | undefined;
let actualButtons: ElementHandle<HTMLButtonElement>[];
let expectedLabelText: string;
let expectedOptions: string[];

beforeAll(async () => {
  const step = new FRStep(data[testName]);
  const callbackType = CallbackType.ConfirmationCallback;
  const callback = step.getCallbackOfType<ConfirmationCallback>(callbackType);
  expectedLabelText = callback.getPrompt();
  expectedOptions = callback.getOptions();

  await setTree(testName);

  actualLabel = expectedLabelText
    ? await getElement<HTMLLabelElement>('.fr-callback-0 label')
    : undefined;
  actualButtons = await getElements<HTMLButtonElement>('.fr-callback-0 button');
});

describe(testName, () => {
  it('renders correctly', async () => {
    if (expectedLabelText) {
      const actualLabelText = await getInnerHtml(actualLabel);
      expect(actualLabelText).toBe(expectedLabelText);
    }

    expect(actualButtons.length).toBe(expectedOptions.length);
    for (let i = 0; i < expectedOptions.length; i++) {
      const buttonText = await getInnerHtml(actualButtons[i]);
      expect(buttonText).toBe(expectedOptions[i]);
    }
  });
});
