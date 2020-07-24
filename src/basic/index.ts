import {
  CallbackType,
  FRStep,
  FRRecoveryCodes,
  FRWebAuthn,
  WebAuthnStepType,
} from '@forgerock/javascript-sdk';
import { FRUIStepHandlerFactory } from '../interfaces';
import { WebAuthnMode } from './enums';
import BasicStepHandler from './handlers/basic';
import DeviceStepHandler from './handlers/device-profile';
import DisplayRecoveryCodes from './handlers/display-recovery-codes';
import WebAuthnStepHandler from './handlers/webauthn';
import { CallbackRendererFactory } from './interfaces';

/**
 * A step handler factory that can process any type of step.
 *
 * @param target The DOM element to contain the generated UI
 * @param step The step to process
 * @param rendererFactory The renderer factory to use when generating UI
 */
const basicStepHandlerFactory: FRUIStepHandlerFactory = (
  target: HTMLElement,
  step: FRStep,
  rendererFactory?: CallbackRendererFactory,
) => {
  if (!step) {
    throw new Error('Cannot create handler; no step specified');
  }

  const webAuthnStepType = FRWebAuthn.getWebAuthnStepType(step);
  if (webAuthnStepType !== WebAuthnStepType.None) {
    const isAuth = webAuthnStepType === WebAuthnStepType.Authentication;
    const webAuthnMode = isAuth ? WebAuthnMode.Authentication : WebAuthnMode.Registration;
    return new WebAuthnStepHandler(target, step, webAuthnMode);
  }

  const isDisplayRecoveryCodesStep = FRRecoveryCodes.isDisplayStep(step); // returns boolean
  if (isDisplayRecoveryCodesStep) {
    return new DisplayRecoveryCodes(target, step);
  }

  const deviceProfileStep = step.getCallbacksOfType(CallbackType.DeviceProfileCallback);
  /**
   * Check if Device Profile is the only callback.
   * If it isn't, handle it within BasicStepHandler.
   */
  if (step.callbacks.length === 1 && deviceProfileStep.length === 1) {
    return new DeviceStepHandler(target, step);
  }

  return new BasicStepHandler(target, step, rendererFactory);
};

export default basicStepHandlerFactory;
export { BasicStepHandler };
