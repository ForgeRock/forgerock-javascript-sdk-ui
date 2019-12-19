import { CallbackType, FRStep, TermsAndConditionsCallback } from '@forgerock/javascript-sdk';
import { ElementHandle } from 'puppeteer';
import data from '../server/data';
import { getElement, getInnerHtml, getProperty, isSubmitEnabled, setTree } from './helpers';

const testName = 'TermsAndConditionsCallbackRenderer';

let actualParagraph: ElementHandle<HTMLParagraphElement>;
let actualCheckbox: ElementHandle<HTMLInputElement>;
let expectedText: string;

beforeAll(async () => {
  const step = new FRStep(data[testName]);
  const callback = step.getCallbackOfType<TermsAndConditionsCallback>(
    CallbackType.TermsAndConditionsCallback,
  );
  expectedText = callback.getTerms();

  await setTree(testName);

  actualParagraph = await getElement<HTMLParagraphElement>('.fr-callback-0 p');
  actualCheckbox = await getElement<HTMLInputElement>('.fr-callback-0 input[type=checkbox]');
});

describe(testName, () => {
  it('renders correctly', async () => {
    // Has the correct text
    const actualParagraphText = await getInnerHtml(actualParagraph);
    expect(actualParagraphText).toBe(expectedText);

    // Checkbox is unchecked
    const actualCheckboxChecked = await getProperty<boolean>(actualCheckbox, 'checked');
    expect(actualCheckboxChecked).toBe(false);

    // Submit is disabled
    const actualSubmitEnabled = await isSubmitEnabled();
    expect(actualSubmitEnabled).toBe(false);
  });

  it('can submit after checking the box', async () => {
    await actualCheckbox.click();
    const actualSubmitEnabled = await isSubmitEnabled();
    expect(actualSubmitEnabled).toBe(true);
  });
});
