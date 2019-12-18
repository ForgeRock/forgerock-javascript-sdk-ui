import FRStepHandlerBase from '../../fr-step-handler-base';
import template from '../views/login-success.html';

/**
 * Handler that renders a successful authentication in Express.
 */
class LoginSuccessStepHandler extends FRStepHandlerBase {
  /** @hidden */
  public retry = undefined;

  protected getTemplate = (): string => {
    return template;
  };

  /**
   * Resolves the handler's Promise immediately.
   */
  protected ready = (): void => this.deferred.resolve(this.step);
}

export default LoginSuccessStepHandler;
