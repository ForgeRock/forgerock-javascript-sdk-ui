import { FRCallback, PolicyRequirement } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';
import { renderErrors } from './errors';

class GenericCallbackRenderer implements CallbackRenderer {
  private input!: HTMLInputElement;

  constructor(
    private callback: FRCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  public destroy = () => {
    this.input.removeEventListener('keyup', this.onInput);
  };

  public focus = () => this.input.focus();

  public isValid = () => this.input && this.input.value.length > 0;

  public render = () => {
    // Create basic structure
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    const formLabelGroup = el<HTMLDivElement>('div', 'form-label-group');
    formGroup.appendChild(formLabelGroup);

    // Add the input element
    this.input = el<HTMLInputElement>('input', 'form-control');
    this.input.id = `fr-callback-${this.index}`;
    this.input.type = 'text';
    this.input.value = this.callback.getInputValue() as string;
    this.input.addEventListener('keyup', this.onInput);
    formLabelGroup.appendChild(this.input);

    // Add the prompt label
    const prompt = this.callback.getOutputByName('prompt', '');
    if (prompt) {
      this.input.placeholder = prompt;
      const label = el<HTMLLabelElement>('label');
      label.innerHTML = prompt;
      label.htmlFor = this.input.id;
      formLabelGroup.appendChild(label);
    }

    // Add policy errors
    const failedPolicies = this.callback.getOutputByName<PolicyRequirement[]>('failedPolicies', []);
    if (failedPolicies.length > 0) {
      const errorList = renderErrors(failedPolicies, prompt);
      if (errorList) {
        formGroup.appendChild(errorList);
      }
    }

    return formGroup;
  };

  private onInput = () => {
    this.callback.setInputValue(this.input.value);
    this.onChange(this);
  };
}

export default GenericCallbackRenderer;
