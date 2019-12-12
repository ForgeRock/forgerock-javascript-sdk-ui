import { FRStep, FRWebAuthn } from '@forgerock/javascript-sdk';
import { FRUIStepHandler } from '../../interfaces';
import Deferred from '../../util/deferred';
import { WebAuthnMode } from '../enums';
import template from '../views/webauthn.html';

class WebAuthnStepHandler implements FRUIStepHandler {
  private message!: HTMLDivElement;
  protected deferred: Deferred<FRStep>;

  constructor(private target: HTMLElement, private step: FRStep, private mode: WebAuthnMode) {
    this.target.innerHTML = template;
    const messageDiv = this.target.querySelector<HTMLDivElement>('.fr-message');
    if (!messageDiv) {
      throw new Error(`Required targets not found in webauthn handler view`);
    }

    this.message = messageDiv;
    this.deferred = new Deferred<FRStep>();
  }

  public completeStep = async (): Promise<FRStep> => {
    switch (this.mode) {
      case WebAuthnMode.Authenticate:
        this.message.innerHTML = 'Please authenticate with your device ...';
        const authenticated = await FRWebAuthn.authenticate(this.step);
        this.deferred.resolve(authenticated);
        break;

      case WebAuthnMode.Register:
        this.message.innerHTML = 'Please register your device ...';
        const registered = await FRWebAuthn.register(this.step);
        this.deferred.resolve(registered);
        break;

      default:
        throw new Error(`Invalid WebAuthn mode "${this.mode}"`);
    }

    return this.deferred.promise;
  };
}

export default WebAuthnStepHandler;
