# E2E Testing

The E2E testing scope is to ensure UI elements are rendered and behave correctly. Integration with a live OpenAM server is not required.

The implementation uses a web page that loads the SDK, OpenAM mock, and initialization script. The initialization script reads values from the querystring to configure the SDK, so individual tests can easily change those values. Helper methods wrap the Puppeteer API to simplify writing tests.

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
const testName = 'MyTest';

let actualCheckbox: ElementHandle<HTMLInputElement>;
let actualLabel: ElementHandle<HTMLLabelElement>;
let expectedChecked: boolean;
let expectedLabelText: string;

// Capture expected values, and then navigate to the test page and capture element references
beforeAll(async () => {
  const step = new FRStep(data[testName]);
  const callbackType = CallbackType.BooleanAttributeInputCallback;
  const callback = step.getCallbackOfType<AttributeInputCallback<boolean>>(callbackType);
  expectedChecked = callback.getInputValue() as boolean;
  expectedLabelText = callback.getPrompt();

  await setTree(testName);

  actualCheckbox = await getElement<HTMLInputElement>('.fr-callback-0 input[type=checkbox]');
  actualLabel = await getElement<HTMLLabelElement>('.fr-callback-0 label');
});

describe(testName, () => {
  it('renders correctly', async () => {
    // Use helpers to get actual values from the page
    const actualChecked = await getProperty<boolean>(actualCheckbox, 'checked');
    const actualLabelText = await getInnerHtml(actualLabel);
    const actualSubmitEnabled = await isSubmitEnabled();

    // Make assertions
    expect(actualChecked).toBe(expectedChecked);
    expect(actualLabelText).toBe(expectedLabelText);
    expect(actualSubmitEnabled).toBe(true);
  });
});
```

[1]: https://github.com/http-party/http-server
[2]: https://github.com/facebook/jest
[3]: https://github.com/puppeteer/puppeteer
[4]: https://github.com/smooth-code/jest-puppeteer
[5]: https://github.com/kulshekhar/ts-jest
