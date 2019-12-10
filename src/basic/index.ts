import { FRStep, FRWebAuthn, WebAuthnStepType } from '@forgerock/javascript-sdk';
import { FRUIStepHandlerFactory } from '../interfaces';
import BasicStepHandler from './handlers/basic';
import WebAuthnStepHandler from './handlers/webauthn';

const basicStepHandlerFactory: FRUIStepHandlerFactory = (target: HTMLElement, step: FRStep) => {
  if (!step) {
    throw new Error('Cannot create handler; no step specified');
  }

  const webAuthnStepType = FRWebAuthn.getWebAuthStepType(step);
  if (webAuthnStepType !== WebAuthnStepType.None) {
    return new WebAuthnStepHandler(target, webAuthnStepType);
  }

  return new BasicStepHandler(target, step);
};

export default basicStepHandlerFactory;
export { BasicStepHandler };
