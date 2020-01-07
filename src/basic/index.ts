import { FRStep, FRWebAuthn, WebAuthnStepType } from '@forgerock/javascript-sdk';
import { FRUIStepHandlerFactory } from '../interfaces';
import { WebAuthnMode } from './enums';
import BasicStepHandler from './handlers/basic';
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

  return new BasicStepHandler(target, step, rendererFactory);
};

export default basicStepHandlerFactory;
export { BasicStepHandler };
