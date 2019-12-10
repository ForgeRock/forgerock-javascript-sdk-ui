import { CallbackType, FRStep } from '@forgerock/javascript-sdk';
import Button from '../../components/button';
import PasswordInput from '../../components/password-input';
import FRStepHandlerBase from '../../fr-step-handler-base';
import Deferred from '../../util/deferred';
import { ExpressStage } from '../enums';
import oneTimeEmailTemplate from '../views/one-time-password-email.html';
import oneTimeSMSTemplate from '../views/one-time-password-sms.html';
import userPasswordTemplate from '../views/user-password.html';

class PasswordStepHandler extends FRStepHandlerBase {
  private password!: HTMLInputElement;
  private submit!: Button;
  private retryMessage!: HTMLParagraphElement;
  private passwordInput!: PasswordInput;

  public getRefs = () => {
    this.password = this.findElement('#fr-password');
    this.submit = new Button(this.findElement('.btn-primary'));
    this.retryMessage = this.findElement('.fr-retry');
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
    switch (this.step.getStage()) {
      case ExpressStage.OneTimePasswordEmail:
        return oneTimeEmailTemplate;
      case ExpressStage.OneTimePasswordSMS:
        return oneTimeSMSTemplate;
      case ExpressStage.UserPassword:
        return userPasswordTemplate;
    }
    throw new Error(`Unsupported password stage "${this.step.getStage()}"`);
  };

  protected ready = () => {
    this.password.focus();
  };

  private onSubmit = () => {
    this.submit.disable();
    this.step.setCallbackValue(CallbackType.PasswordCallback, this.password.value);
    this.unbind();
    this.deferred.resolve(this.step);
  };
}

export default PasswordStepHandler;
