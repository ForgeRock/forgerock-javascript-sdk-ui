# E2E Testing

The E2E testing scope is to ensure UI elements are rendered and behave correctly. Integration with a live OpenAM server is not required.

The implementation uses a web page that loads the SDK, OpenAM mock, and initialization script. The initialization script reads values from
the querystring to configure the SDK, so individual tests can easily change those values. Helper methods wrap the Puppeteer API to simplify
writing tests.

## Tooling

| Library             | What it's used for                                     |
| ------------------- | ------------------------------------------------------ |
| [http-server][1]    | Serving test pages with local dev server               |
| [jest][2]           | Framework for creating tests                           |
| [ts-jest][5]        | Testing TypeScript projects with Jest                  |
| [puppeteer][3]      | Automating full or headless Chrome or Chromium browser |
| [jest-puppeteer][4] | Start/stop web server and provide helper assertions    |

## Tests

Each test should load the test page, specifying a tree name that matches a property in the mocked data object. The mocked data can be consumed with the core SDK to more easily access expected values.

```ts
describe('MyTest', () => {
  it('works correctly', async () => {
    try {
      // Use the SDK to simplify consuming mocked data
      const step = new FRStep(data.MyTest);
      const callback = step.getCallbackOfType<AttributeInputCallback<boolean>>(
        CallbackType.BooleanAttributeInputCallback,
      );
      const expectedChecked = callback.getInputValue() as boolean;
      const expectedLabel = callback.getPrompt();

      // Load the test page
      await setTree('MyTest');

      // Use helpers to get actual values from the page
      const actualChecked = await getProperty<boolean>('#fr-callback-0', 'checked');
      const actualLabel = await getInnerHtml('label');
      const actualSubmitEnabled = await isSubmitEnabled();

      // Make assertions
      expect(actualChecked).toBe(expectedChecked);
      expect(actualLabel).toBe(expectedLabel);
      expect(actualSubmitEnabled).toBe(true);
    } catch (error) {
      fail(error);
    }
  });
});
```

[1]: https://github.com/http-party/http-server
[2]: https://github.com/facebook/jest
[3]: https://github.com/puppeteer/puppeteer
[4]: https://github.com/smooth-code/jest-puppeteer
[5]: https://github.com/kulshekhar/ts-jest
