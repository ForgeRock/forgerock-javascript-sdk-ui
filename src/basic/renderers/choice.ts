import { ChoiceCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';

class ChoiceCallbackRenderer implements CallbackRenderer {
  private input!: HTMLSelectElement;

  constructor(
    private callback: ChoiceCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  public destroy = () => {
    this.input.removeEventListener('change', this.onInput);
  };

  public focus = () => {
    this.input.focus();
  };

  public isValid = () => this.input && this.input.value.length > 0;

  public render = () => {
    const defaultIndex = this.callback.getInputValue() as number;
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    const id = `fr-callback-${this.index}`;

    // Add the prompt
    const prompt = this.callback.getPrompt();
    if (prompt) {
      const label = el<HTMLLabelElement>('label');
      label.innerHTML = prompt;
      label.htmlFor = id;
      formGroup.appendChild(label);
    }

    // Add the dropdown
    this.input = el<HTMLSelectElement>('select', 'form-control');
    this.input.id = id;
    this.input.addEventListener('change', this.onInput);
    this.callback.getChoices().forEach((x, i) => {
      const option = el<HTMLOptionElement>('option');
      option.value = i.toString();
      option.text = x;
      option.selected = i === defaultIndex;
      this.input.appendChild(option);
    });
    formGroup.appendChild(this.input);

    return formGroup;
  };

  private onInput = () => {
    this.callback.setChoiceIndex(Number(this.input.value));
    this.onChange(this);
  };
}

export default ChoiceCallbackRenderer;
