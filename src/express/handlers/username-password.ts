import { CallbackType, FRStep } from '@forgerock/javascript-sdk';
import Button from '../../components/button';
import PasswordInput from '../../components/password-input';
import FRStepHandlerBase from '../../fr-step-handler-base';
import Deferred from '../../util/deferred';
import template from '../views/username-password.html';

/**
 * Handler that renders inputs for username and password in an Express step.
 */
class UsernamePasswordStepHandler extends FRStepHandlerBase {
  private password!: HTMLInputElement;
  private retryMessage!: HTMLParagraphElement;
  private submit!: Button;
  private username!: HTMLInputElement;
  private passwordInput!: PasswordInput;

  /**
   * Displays a retry message and enables the submit button.
   */
  public retry = () => {
    this.deferred = new Deferred<FRStep>();
    this.retryMessage.style.display = 'block';
    this.submit.enable();
    this.bind();
    return this.deferred.promise;
  };

  protected bind = () => {
    this.submit.bind(this.onSubmit);
    this.passwordInput.bind();
  };

  protected unbind = () => {
    this.submit.unbind(this.onSubmit);
    this.passwordInput.unbind();
  };

  protected getRefs = () => {
    this.username = this.findElement('#fr-username');
    this.password = this.findElement('#fr-password');
    this.retryMessage = this.findElement('.fr-retry');
    this.submit = new Button(this.findElement('.btn-primary'));
    this.passwordInput = new PasswordInput(this.password);
  };

  protected getTemplate = () => {
    return template;
  };

  protected ready = () => {
    this.username.focus();
  };

  protected onSubmit = () => {
    this.submit.disable();
    this.step.setCallbackValue(CallbackType.NameCallback, this.username.value);
    this.step.setCallbackValue(CallbackType.PasswordCallback, this.password.value);
    this.unbind();

    this.deferred.resolve(this.step);
  };
}

export default UsernamePasswordStepHandler;
