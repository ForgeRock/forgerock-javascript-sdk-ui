import { CallbackType, FRStep, TextOutputCallback } from '@forgerock/javascript-sdk';
import { ElementHandle } from 'puppeteer';
import data from '../server/data';
import { getElement, getInnerHtml, isSubmitEnabled, setTree } from './helpers';

const testName = 'TextOutputCallbackRenderer';

let actualParagraph: ElementHandle<HTMLParagraphElement>;
let expectedText: string;

beforeAll(async () => {
  const step = new FRStep(data[testName]);
  const callback = step.getCallbackOfType<TextOutputCallback>(CallbackType.TextOutputCallback);
  expectedText = callback.getMessage();

  await setTree(testName);

  actualParagraph = await getElement<HTMLParagraphElement>('.fr-callback-0 p');
});

describe(testName, () => {
  it('renders correctly', async () => {
    // Has the correct text
    const actualParagraphText = await getInnerHtml(actualParagraph);
    expect(actualParagraphText).toBe(expectedText);

    // Submit is enabled
    const actualSubmitEnabled = await isSubmitEnabled();
    expect(actualSubmitEnabled).toBe(true);
  });
});
