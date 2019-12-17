import data from '../server/data';
import { getAttribute, getInnerHtml, isSubmitEnabled, setTree } from './helpers';

describe('BooleanAttributeCallbackRenderer', () => {
  it('works correctly', async () => {
    try {
      await setTree('BooleanAttributeCallbackRendererTest');
      const actualChecked = await getAttribute('#fr-callback-0', 'checked');
      const actualLabel = await getInnerHtml('label');
      const actualSubmitEnabled = await isSubmitEnabled();
      const expectedLabel = data.BooleanAttributeCallbackRendererTest.callbacks[0].output[0].value;
      expect(actualChecked).toBe(false);
      expect(actualLabel).toBe(expectedLabel);
      expect(actualSubmitEnabled).toBe(true);
    } catch (error) {
      fail(error);
    }
  });
});
