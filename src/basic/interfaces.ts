import { FRCallback, FRStep } from '@forgerock/javascript-sdk';

interface CallbackRenderer {
  destroy?: () => void;
  focus?: () => void;
  isValid?: () => boolean;
  onInjected?: () => void;
  render: () => HTMLElement;
}

interface FocusableCallbackRenderer extends CallbackRenderer {
  focus: () => void;
}

interface DestroyableCallbackRenderer extends CallbackRenderer {
  destroy: () => void;
}

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
