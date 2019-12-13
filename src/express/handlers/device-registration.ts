import { FRWebAuthn } from '@forgerock/javascript-sdk';
import FRStepHandlerBase from '../../fr-step-handler-base';
import template from '../views/device-registration.html';

/**
 * Handler that renders a WebAuthn registration step in Express.
 */
class DeviceRegistrationStepHandler extends FRStepHandlerBase {
  private heading!: HTMLHeadingElement;

  /** @hidden */
  public retry = undefined;

  protected getRefs = () => {
    this.heading = this.findElement('h2');
  };

  protected render = () => {
    this.target.innerHTML = template;
    this.invokeWebAuthn();
  };

  protected invokeWebAuthn = async () => {
    this.heading.innerHTML = 'Acquiring device credentials...';
    const result = await FRWebAuthn.register(this.step);
    this.deferred.resolve(result);
  };
}

export default DeviceRegistrationStepHandler;
