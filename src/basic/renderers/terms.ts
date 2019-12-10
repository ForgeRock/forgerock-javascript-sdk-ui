import { TermsAndConditionsCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';

class TermsAndConditionsCallbackRenderer implements CallbackRenderer {
  private input!: HTMLInputElement;

  constructor(
    private callback: TermsAndConditionsCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  public destroy = () => {
    this.input.removeEventListener('change', this.onInput);
  };

  public focus = () => {
    this.input.focus();
  };

  public isValid = () => this.input && this.input.checked;

  public render = () => {
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);

    // Add the terms
    const p = el<HTMLParagraphElement>('p');
    p.innerHTML = this.callback.getTerms();
    formGroup.appendChild(p);

    // Add the checkbox and label
    const formCheck = el<HTMLDivElement>('div', 'form-check mb-3');
    formGroup.appendChild(formCheck);
    this.input = el<HTMLInputElement>('input', 'form-check-input');
    this.input.checked = this.callback.getInputValue() as boolean;
    this.input.id = `fr-callback-${this.index}`;
    this.input.type = 'checkbox';
    this.input.addEventListener('change', this.onInput);
    formCheck.appendChild(this.input);
    const label = el<HTMLLabelElement>('label', 'form-check-label');
    label.innerHTML = 'I have read and agree to the terms and conditions';
    label.htmlFor = this.input.id;
    formCheck.appendChild(label);

    return formGroup;
  };

  private onInput = () => {
    this.callback.setAccepted(this.input.checked);
    this.onChange(this);
  };
}

export default TermsAndConditionsCallbackRenderer;
