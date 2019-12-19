import { CallbackType, ChoiceCallback, FRStep } from '@forgerock/javascript-sdk';
import { ElementHandle } from 'puppeteer';
import data from '../server/data';
import { getElement, getInnerHtml, getValue, isSubmitEnabled, setTree } from './helpers';

const testName = 'ChoiceCallbackRenderer';

let actualLabel: ElementHandle<HTMLLabelElement>;
let actualDropdown: ElementHandle<HTMLSelectElement>;
let expectedLabelText: string;
let expectedSelected: number;

beforeAll(async () => {
  const step = new FRStep(data[testName]);
  const callback = step.getCallbackOfType<ChoiceCallback>(CallbackType.ChoiceCallback);
  expectedLabelText = callback.getPrompt();
  expectedSelected = callback.getDefaultChoice();

  await setTree(testName);

  actualLabel = await getElement<HTMLLabelElement>('.fr-callback-0 label');
  actualDropdown = await getElement<HTMLSelectElement>('.fr-callback-0 select');
});

describe(testName, () => {
  it('renders correctly', async () => {
    const actualLabelText = await getInnerHtml(actualLabel);
    const actualDropdownValue = parseInt(await getValue(actualDropdown));
    const actualSubmitEnabled = await isSubmitEnabled();

    expect(actualLabelText).toBe(expectedLabelText);
    expect(actualDropdownValue).toBe(expectedSelected);
    expect(actualSubmitEnabled).toBe(true);
  });
});
