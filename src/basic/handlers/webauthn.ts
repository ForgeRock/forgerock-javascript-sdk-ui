import { FRStep, FRWebAuthn, WebAuthnStepType } from '@forgerock/javascript-sdk';
import { FRUIStepHandler } from '../../interfaces';
import Deferred from '../../util/deferred';
import template from '../views/webauthn.html';

class WebAuthnStepHandler implements FRUIStepHandler {
  private message!: HTMLDivElement;
  protected deferred: Deferred<FRStep>;

  constructor(private target: HTMLElement, private stepType: WebAuthnStepType) {
    this.target.innerHTML = template;
    const messageDiv = this.target.querySelector<HTMLDivElement>('.fr-message');
    if (!messageDiv) {
      throw new Error(`Required targets not found in webauthn handler view`);
    }

    this.message = messageDiv;
    this.deferred = new Deferred<FRStep>();
  }

  public completeStep = async (step: FRStep): Promise<FRStep> => {
    switch (this.stepType) {
      case WebAuthnStepType.Authentication:
        this.message.innerHTML = 'Please authenticate with your device ...';
        const authenticated = await FRWebAuthn.authenticate(step);
        this.deferred.resolve(authenticated);
        break;

      case WebAuthnStepType.Registration:
        this.message.innerHTML = 'Please register your device ...';
        const registered = await FRWebAuthn.register(step);
        this.deferred.resolve(registered);
        break;

      default:
        throw new Error(`Unexpected webauthn step type "${this.stepType}"`);
    }

    return this.deferred.promise;
  };
}

export default WebAuthnStepHandler;
