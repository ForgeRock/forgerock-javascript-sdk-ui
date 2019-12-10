import FRStepHandlerBase from '../../fr-step-handler-base';
import template from '../views/device-registration.html';

class DeviceRegistrationStepHandler extends FRStepHandlerBase {
  private heading!: HTMLHeadingElement;

  public completeStep = () => {
    this.render();
    this.getRefs();
    this.invokeWebAuthn();
    return this.deferred.promise;
  };

  public getRefs = () => {
    this.heading = this.findElement('h2');
  };

  protected getTemplate = () => {
    return template;
  };

  private invokeWebAuthn = async () => {
    this.heading.innerHTML = 'Confirming device credentials...';
    throw new Error('Integration of SDK webauthn is not complete');
  };
}

export default DeviceRegistrationStepHandler;
