import { AttributeInputCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';
import { renderErrors } from './errors';

class BooleanAttributeCallbackRenderer implements CallbackRenderer {
  private input!: HTMLInputElement;

  constructor(
    private callback: AttributeInputCallback<boolean>,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  public destroy = () => {
    this.input.removeEventListener('change', this.onInput);
  };

  public focus = () => {
    this.input.focus();
  };

  public render = () => {
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-check mb-3`);

    // Add checkbox
    this.input = el<HTMLInputElement>('input', 'form-check-input');
    this.input.checked = this.callback.getInputValue() as boolean;
    this.input.id = `fr-callback-${this.index}`;
    this.input.type = 'checkbox';
    this.input.addEventListener('change', this.onInput);
    formGroup.appendChild(this.input);

    // Add label
    const prompt = this.callback.getPrompt();
    if (prompt) {
      const label = el<HTMLLabelElement>('label', 'form-check-label');
      label.innerHTML = prompt;
      label.htmlFor = this.input.id;
      formGroup.appendChild(label);
    }

    // Add policy errors
    const errorList = renderErrors(this.callback.getFailedPolicies(), prompt);
    if (errorList) {
      formGroup.appendChild(errorList);
    }

    return formGroup;
  };

  private onInput = () => {
    this.callback.setValue(this.input.checked);
    this.onChange(this);
  };
}

export default BooleanAttributeCallbackRenderer;
