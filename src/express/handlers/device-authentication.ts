import { FRWebAuthn } from '@forgerock/javascript-sdk';
import FRStepHandlerBase from '../../fr-step-handler-base';
import template from '../views/device-authentication.html';

/**
 * Handler that renders a WebAuthn authentication step in Express.
 */
class DeviceAuthenticationStepHandler extends FRStepHandlerBase {
  private heading!: HTMLHeadingElement;

  /** @hidden */
  public retry = undefined;

  protected getRefs = (): void => {
    this.heading = this.findElement('h2');
  };

  protected render = (): void => {
    this.target.innerHTML = template;
    this.invokeWebAuthn();
  };

  protected invokeWebAuthn = async (): Promise<void> => {
    this.heading.innerHTML = 'Confirming device credentials...';
    const result = await FRWebAuthn.authenticate(this.step);
    this.deferred.resolve(result);
  };
}

export default DeviceAuthenticationStepHandler;
