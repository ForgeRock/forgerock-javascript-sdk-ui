import { CallbackType, FRStep } from '@forgerock/javascript-sdk';
import Button from '../../components/button';
import PasswordInput from '../../components/password-input';
import FRStepHandlerBase from '../../fr-step-handler-base';
import Deferred from '../../util/deferred';
import template from '../views/username-password.html';

class UsernamePasswordStepHandler extends FRStepHandlerBase {
  private password!: HTMLInputElement;
  private retryMessage!: HTMLParagraphElement;
  private submit!: Button;
  private username!: HTMLInputElement;
  private passwordInput!: PasswordInput;

  public getRefs = () => {
    this.username = this.findElement('#fr-username');
    this.password = this.findElement('#fr-password');
    this.retryMessage = this.findElement('.fr-retry');
    this.submit = new Button(this.findElement('.btn-primary'));
    this.passwordInput = new PasswordInput(this.password);
  };

  public retry = () => {
    this.deferred = new Deferred<FRStep>();
    this.retryMessage.style.display = 'block';
    this.submit.enable();
    this.bind();
    return this.deferred.promise;
  };

  public bind = () => {
    this.submit.bind(this.onSubmit);
    this.passwordInput.bind();
  };

  protected unbind = () => {
    this.submit.unbind(this.onSubmit);
    this.passwordInput.unbind();
  };

  protected getTemplate = () => {
    return template;
  };

  protected ready = () => {
    this.username.focus();
  };

  private onSubmit = () => {
    this.submit.disable();
    this.step.setCallbackValue(CallbackType.NameCallback, this.username.value);
    this.step.setCallbackValue(CallbackType.PasswordCallback, this.password.value);
    this.unbind();

    this.deferred.resolve(this.step);
  };
}

export default UsernamePasswordStepHandler;
