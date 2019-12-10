import { CallbackType, FRStep } from '@forgerock/javascript-sdk';
import Button from '../../components/button';
import FRStepHandlerBase from '../../fr-step-handler-base';
import Deferred from '../../util/deferred';
import template from '../views/username.html';

class UsernameStepHandler extends FRStepHandlerBase {
  private username!: HTMLInputElement;
  private retryMessage!: HTMLParagraphElement;
  private submit!: Button;

  public getRefs = () => {
    this.retryMessage = this.findElement('.fr-retry');
    this.submit = new Button(this.findElement('.btn-primary'));
    this.username = this.findElement('#fr-username');
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
  };

  protected unbind = () => {
    this.submit.unbind(this.onSubmit);
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
    this.unbind();
    this.deferred.resolve(this.step);
  };
}

export default UsernameStepHandler;
