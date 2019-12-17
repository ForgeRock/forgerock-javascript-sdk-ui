import { CallbackType, ChoiceCallback, FRStep } from '@forgerock/javascript-sdk';
import data from '../server/data';
import { getInnerHtml, getValue, isSubmitEnabled, setTree } from './helpers';

describe('ChoiceCallbackRenderer', () => {
  it('works correctly', async () => {
    try {
      const step = new FRStep(data.ChoiceCallbackRendererTest);
      const callback = step.getCallbackOfType<ChoiceCallback>(CallbackType.ChoiceCallback);
      const expectedLabel = callback.getPrompt();
      const expectedSelected = callback.getDefaultChoice();

      await setTree('ChoiceCallbackRendererTest');

      const actualLabel = await getInnerHtml('label');
      const actualSelected = await getValue('#fr-callback-0');
      const actualSubmitEnabled = await isSubmitEnabled();

      expect(actualLabel).toBe(expectedLabel);
      expect(parseInt(actualSelected as string)).toBe(expectedSelected);
      expect(actualSubmitEnabled).toBe(true);
    } catch (error) {
      fail(error);
    }
  });
});
