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
  public retry = (): Promise<FRStep> => {
    this.deferred = new Deferred<FRStep>();
    this.retryMessage.style.display = 'block';
    this.submit.enable();
    this.bind();
    return this.deferred.promise;
  };

  protected bind = (): void => {
    this.submit.bind(this.onSubmit);
    this.passwordInput.bind();
  };

  protected unbind = (): void => {
    this.submit.unbind(this.onSubmit);
    this.passwordInput.unbind();
  };

  protected getRefs = (): void => {
    this.username = this.findElement('#fr-username');
    this.password = this.findElement('#fr-password');
    this.retryMessage = this.findElement('.fr-retry');
    this.submit = new Button(this.findElement('.btn-primary'));
    this.passwordInput = new PasswordInput(this.password);
  };

  protected getTemplate = (): string => {
    return template;
  };

  protected ready = (): void => {
    this.username.focus();
  };

  protected onSubmit = (): void => {
    this.submit.disable();
    this.step.setCallbackValue(CallbackType.NameCallback, this.username.value);
    this.step.setCallbackValue(CallbackType.PasswordCallback, this.password.value);
    this.unbind();

    this.deferred.resolve(this.step);
  };
}

export default UsernamePasswordStepHandler;
