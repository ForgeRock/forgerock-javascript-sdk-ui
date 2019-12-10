import { ConfirmationCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';

interface ConfirmationButton {
  element: HTMLButtonElement;
  handler: (e: MouseEvent) => void;
}

class ConfirmationCallbackRenderer implements CallbackRenderer {
  private buttons!: ConfirmationButton[];

  constructor(
    private callback: ConfirmationCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  public destroy = () => {
    this.buttons.forEach((x) => x.element.removeEventListener('click', x.handler));
    this.buttons = [];
  };

  public focus = () => {
    this.buttons[0].element.focus();
  };

  public render = () => {
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    const formLabelGroup = el<HTMLDivElement>('div', 'form-label-group');

    // Add the prompt
    const prompt = this.callback.getPrompt();
    if (prompt) {
      const label = el<HTMLLabelElement>('label');
      label.innerHTML = prompt;
      formLabelGroup.appendChild(label);
    }

    // Add the buttons
    const defaultOption = this.callback.getDefaultOption();
    this.buttons = this.callback.getOptions().map((x, i) => {
      const handler = () => this.onInput(i);
      const element = el<HTMLButtonElement>('button');
      element.className = defaultOption === i ? 'btn btn-primary' : 'btn';
      element.innerHTML = x;
      element.addEventListener('click', handler);
      return { element, handler };
    });
    this.buttons.forEach((x) => formLabelGroup.appendChild(x.element));

    return formGroup;
  };

  private onInput = (index: number) => {
    this.callback.setInputValue(index);
    this.onChange(this);
  };
}

export default ConfirmationCallbackRenderer;
