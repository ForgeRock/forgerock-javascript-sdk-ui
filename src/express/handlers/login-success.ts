import FRStepHandlerBase from 'fr-step-handler-base';
import template from '../views/login-success.html';

class LoginSuccessStepHandler extends FRStepHandlerBase {
  public completeStep = () => {
    this.render();
    this.deferred.resolve(this.step);
    return this.deferred.promise;
  };

  protected getTemplate = () => {
    return template;
  };
}

export default LoginSuccessStepHandler;
