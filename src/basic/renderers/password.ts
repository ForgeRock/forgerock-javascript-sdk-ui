import { PasswordCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';
import { renderErrors } from './errors';

class PasswordCallbackRenderer implements CallbackRenderer {
  private input!: HTMLInputElement;
  private toggle!: HTMLButtonElement;
  private toggleIcon!: HTMLElement;

  constructor(
    private callback: PasswordCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  public destroy = () => {
    this.input.removeEventListener('keyup', this.onInput);
    this.toggle.removeEventListener('click', this.toggleView);
  };

  public focus = () => {
    this.input.focus();
  };

  public isValid = () => this.input && this.input.value.length > 0;

  public render = () => {
    // Create the basic structure
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    const formLabelGroup = el<HTMLDivElement>('div', 'form-label-group form-label-group-password');
    const formLabelGroupInput = el<HTMLDivElement>('div', 'form-label-group-input');
    const formInputGroupAppend = el<HTMLDivElement>('div', 'input-group-append');
    formLabelGroup.appendChild(formLabelGroupInput);
    formLabelGroup.appendChild(formInputGroupAppend);
    formGroup.appendChild(formLabelGroup);

    // Add the input
    this.input = el<HTMLInputElement>('input', 'form-control');
    this.input.id = `fr-callback-${this.index}`;
    this.input.addEventListener('keyup', this.onInput);
    formLabelGroupInput.appendChild(this.input);

    // Add the prompt
    const prompt = this.callback.getPrompt();
    if (prompt) {
      this.input.placeholder = prompt;
      const label = el<HTMLLabelElement>('label');
      label.innerHTML = prompt;
      label.htmlFor = this.input.id;
      formLabelGroupInput.appendChild(label);
    }

    // Add the view/hide toggle
    this.toggle = el<HTMLButtonElement>('button', 'btn btn-outline-secondary');
    this.toggle.type = 'button';
    this.toggle.addEventListener('click', this.toggleView);
    this.toggleIcon = el<HTMLElement>('i', 'material-icons material-icons-outlined');
    this.toggle.appendChild(this.toggleIcon);
    formInputGroupAppend.appendChild(this.toggle);

    // Add policy errors
    const errorList = renderErrors(this.callback.getFailedPolicies(), prompt);
    if (errorList) {
      formGroup.appendChild(errorList);
    }

    this.setView(false);

    return formGroup;
  };

  private setView = (showPassword: boolean) => {
    this.input.type = showPassword ? 'text' : 'password';
    this.toggleIcon.innerHTML = showPassword ? 'visibility_off' : 'visibility';
  };

  private toggleView = () => {
    this.setView(this.input.type === 'password');
  };

  private onInput = () => {
    this.callback.setPassword(this.input.value);
    this.onChange(this);
  };
}

export default PasswordCallbackRenderer;
