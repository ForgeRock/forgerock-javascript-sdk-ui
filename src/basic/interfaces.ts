import { FRCallback, FRStep } from '@forgerock/javascript-sdk';

/**
 * Represents a callback renderer that can be consumed by a step handler.
 */
interface CallbackRenderer {
  /**
   * Handles any cleanup necessary after a step has been handled.
   */
  destroy?: () => void;

  /**
   * Prepares the UI element for user interaction.
   */
  focus?: () => void;

  /**
   * Gets whether the callback is valid for submission.
   */
  isValid?: () => boolean;

  /**
   * Handles any actions required after the callback's UI has been added to the DOM.
   */
  onInjected?: () => void;

  /**
   * Generates the UI for the callback and returns its top-level DOM element.
   */
  render: () => HTMLElement;
}

/**
 * A callback renderer that implements `focus()`.
 */
interface FocusableCallbackRenderer extends CallbackRenderer {
  focus: () => void;
}

/**
 * A callback renderer that implements `destroy()`.
 */
interface DestroyableCallbackRenderer extends CallbackRenderer {
  destroy: () => void;
}

/**
 * Represents a callback renderer factory.
 *
 * @param cb The callback to render
 * @param index The index position of the callback in the step
 * @param step The step that contains the callback
 * @param onChange A function to call when the callback value changes
 */
type CallbackRendererFactory = (
  cb: FRCallback,
  index: number,
  step: FRStep,
  onChange: () => void,
) => CallbackRenderer | undefined;

export {
  CallbackRenderer,
  CallbackRendererFactory,
  DestroyableCallbackRenderer,
  FocusableCallbackRenderer,
};
