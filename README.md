# ForgeRock JavaScript SDK with UI

The ForgeRock JavaScript SDK with UI contains the [Core SDK](https://github.com/ForgeRock/forgerock-javascript-sdk) and adds UI rendering capability. This greatly reduces the effort required to add intelligent authentication to your application so you can focus on your application logic.

## Installation

```bash
npm install @forgerock/javascript-sdk-ui
```

## Concepts

The two key concepts in the SDK are **Step Handlers** and **Callback Renderers**. Step handlers control how a given step in an authentication tree is handled, and callback renderers control how each callback in that step is rendered.

For example, a single authentication tree might use a Choice Collector in different ways:

- To ask if the user wants to register a security device
- To ask how the user wants to receive a one-time password

In the first scenario, simple yes/no buttons aligned horizontally may suffice. But you might want to render a vertical list with custom icons for each option in the second scenario. You could create custom step handlers to invoke the correct custom callback renderer (buttons vs list).

This SDK includes two UI step handlers: Basic and Express.

## Basic

This is the default UI and can be used with any OpenAM installation version 6.5.2 or greater. It can render all of the [supported callbacks](https://sdks.forgerock.com/getting-started/compatibility/) with generic styling based on Bootstrap 4. You can optionally add your own CSS to customize or brand the user experience.

The out-of-box integration is extremely simple:

```js
const frui = new forgerock.FRUI();
const result = await frui.getSession();
```

### Taking More Control

If you need deeper customization, you can override built-in behavior at both the step and callback levels by providing factory functions.

The following example overrides the rendering of the callback produced by the "Platform Username" tree node:

```js
// Define a factory that returns the custom callback renderer
const myRendererFactory = (cb, index, step, onChange) => {
  if (cb.getType() === 'ValidatedCreateUsernameCallback') {
    return {
      render: () => {
        // Render the custom UI here
        const div = document.createElement('div');
        div.innerHTML = 'This is a custom UI for capturing username';
        return div;
      },
    };
  }

  // Return `undefined` to defer to the SDK for other callback types
  return undefined;
};

// Define a factory that returns the step handler
const myHandlerFactory = (target, step) => {
  return new forgerock.BasicStepHandler(target, step, myRendererFactory);
};

// Use the step handler factory when instantiating FRUI
const frui = new forgerock.FRUI({ handlerFactory: myHandlerFactory });
const result = await frui.getSession();
```

## Express

ForgeRock Identity Cloud Express offers four built-in authentication trees ranging from simple username/password login to MFA including WebAuthn. The Express step handler renders an optimized user experience for these trees.

```js
// Specify the Express step handler factory when instantiating FRUI
const frui = new forgerock.FRUI({
  handlerFactory: forgerock.expressStepHandlerFactory,
});
const result = await frui.getSession();
```

## Version History

[Our version history can be viewed by visiting our CHANGELOG.md](https://github.com/ForgeRock/forgerock-javascript-sdk-ui/blob/master/CHANGELOG.md).
