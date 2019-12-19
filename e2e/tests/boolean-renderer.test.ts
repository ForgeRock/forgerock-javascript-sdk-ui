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
    const actualLabelText = await getInnerHtml(actualLabel);
    const actualChecked = await getProperty<boolean>(actualCheckbox, 'checked');
    const actualSubmitEnabled = await isSubmitEnabled();

    expect(actualLabelText).toBe(expectedLabelText);
    expect(actualChecked).toBe(expectedChecked);
    expect(actualSubmitEnabled).toBe(true);
  });
});
