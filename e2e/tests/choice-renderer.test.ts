import data from '../server/data';
import { getAttribute, getInnerHtml, isSubmitEnabled, setTree } from './helpers';

describe('ChoiceCallbackRenderer', () => {
  it('works correctly', async () => {
    try {
      await setTree('ChoiceCallbackRendererTest');
      const actualSelected = await getAttribute('#fr-callback-0', 'value');
      const actualLabel = await getInnerHtml('label');
      const actualSubmitEnabled = await isSubmitEnabled();
      const callback = data.ChoiceCallbackRendererTest.callbacks[0];
      const expectedLabel = callback.output[0].value;
      const expectedSelected = callback.output[2].value;
      expect(parseInt(actualSelected as string)).toBe(expectedSelected);
      expect(actualLabel).toBe(expectedLabel);
      expect(actualSubmitEnabled).toBe(true);
    } catch (error) {
      fail(error);
    }
  });
});
