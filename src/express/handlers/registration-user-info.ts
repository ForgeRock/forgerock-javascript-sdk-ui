import { AttributeInputCallback, CallbackType, FRStep } from '@forgerock/javascript-sdk';
import Button from '../../components/button';
import PasswordInput from '../../components/password-input';
import FRStepHandlerBase from '../../fr-step-handler-base';
import Deferred from '../../util/deferred';
import template from '../views/registration.html';

/**
 * Handler that renders inputs for username and password in an Express step, as well as
 * inputs for each optional attribute being collected.
 */
class RegistrationUserInfoStepHandler extends FRStepHandlerBase {
  private username!: HTMLInputElement;
  private password!: HTMLInputElement;
  private passwordInput!: PasswordInput;
  private retryMessage!: HTMLParagraphElement;
  private submit!: Button;

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
    this.passwordInput.bind();
    this.submit.bind(this.onSubmit);
  };

  protected unbind = (): void => {
    this.passwordInput.unbind();
    this.submit.unbind(this.onSubmit);
  };

  protected getRefs = (): void => {
    this.username = this.findElement('#fr-username');
    this.password = this.findElement('#fr-password');
    this.passwordInput = new PasswordInput(this.password);
    this.retryMessage = this.findElement('.fr-retry');
    this.submit = new Button(this.findElement('.btn-primary'));
    this.addAttributeInputs();
  };

  protected getTemplate = (): string => {
    return template;
  };

  protected ready = (): void => {
    this.username.focus();
  };

  protected addAttributeInputs = (): void => {
    const container = this.findElement('#fr-attributes');
    const callbacks = this.step.getCallbacksOfType<AttributeInputCallback<string>>(
      CallbackType.StringAttributeInputCallback,
    );

    const formGroups: HTMLDivElement[] = [];
    for (const cb of callbacks) {
      const name = cb.getName();
      const prompt = cb.getPrompt();
      if (name && prompt) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const formLabel = document.createElement('div');
        formLabel.className = 'form-label-group mb-0';

        const input = document.createElement('input');
        input.className = 'form-control';
        input.id = `fr-${name}`;
        input.name = name;
        input.placeholder = prompt;
        input.required = true;
        input.type = 'text';

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.innerHTML = prompt;

        formLabel.append(input);
        formLabel.append(label);
        formGroup.append(formLabel);

        formGroups.push(formGroup);
      }
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.append(...formGroups);
  };

  protected onSubmit = async (): Promise<void> => {
    this.submit.disable('Registering...');

    this.step.setCallbackValue(CallbackType.ValidatedCreateUsernameCallback, this.username.value);
    this.step.setCallbackValue(CallbackType.ValidatedCreatePasswordCallback, this.password.value);

    const callbacks = this.step.getCallbacksOfType<AttributeInputCallback<string>>(
      CallbackType.StringAttributeInputCallback,
    );

    for (const cb of callbacks) {
      const name = cb.getName();
      if (name) {
        const elem = this.findElement<HTMLInputElement>(`#fr-${name}`);
        if (elem) {
          cb.setInputValue(elem.value);
        }
      }
    }

    this.unbind();
    this.deferred.resolve(this.step);
  };
}

export default RegistrationUserInfoStepHandler;
