import { AttributeInputCallback, CallbackType, FRStep } from '@forgerock/javascript-sdk';
import data from '../server/data';
import { getInnerHtml, getProperty, isSubmitEnabled, setTree } from './helpers';

describe('BooleanAttributeCallbackRenderer', () => {
  it('works correctly', async () => {
    try {
      const step = new FRStep(data.BooleanAttributeCallbackRendererTest);
      const callback = step.getCallbackOfType<AttributeInputCallback<boolean>>(
        CallbackType.BooleanAttributeInputCallback,
      );
      const expectedLabel = callback.getPrompt();
      const expectedChecked = callback.getInputValue() as boolean;

      await setTree('BooleanAttributeCallbackRendererTest');

      const actualLabel = await getInnerHtml('label');
      const actualChecked = await getProperty<boolean>('#fr-callback-0', 'checked');
      const actualSubmitEnabled = await isSubmitEnabled();

      expect(actualLabel).toBe(expectedLabel);
      expect(actualChecked).toBe(expectedChecked);
      expect(actualSubmitEnabled).toBe(true);
    } catch (error) {
      fail(error);
    }
  });
});
