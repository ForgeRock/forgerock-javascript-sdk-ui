import FRStepHandlerBase from '../../fr-step-handler-base';
import template from '../views/device-authentication.html';

class DeviceAuthenticationStepHandler extends FRStepHandlerBase {
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

  public invokeWebAuthn = async () => {
    this.heading.innerHTML = 'Confirming device credentials...';
    throw new Error('Integration of SDK webauthn is not complete');
  };

  protected getTemplate = () => {
    return template;
  };
}

export default DeviceAuthenticationStepHandler;
