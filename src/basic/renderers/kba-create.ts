import { KbaCreateCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';

const TEXT = {
  answerLabel: 'Answer',
  customLabel: 'Custom Question',
};

class KbaCreateCallbackRenderer implements CallbackRenderer {
  private select!: HTMLSelectElement;
  private custom!: HTMLInputElement;
  private customWrap!: HTMLDivElement;
  private answer!: HTMLInputElement;

  constructor(
    private callback: KbaCreateCallback,
    private index: number,
    private kbaIndex: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  public destroy = () => {
    this.select.removeEventListener('change', this.onQuestionChange);
    this.custom.removeEventListener('keyup', this.onInput);
    this.answer.removeEventListener('keyup', this.onInput);
  };

  public focus = () => {
    this.select.focus();
  };

  public isValid = () => {
    if (!this.select || !this.custom || !this.answer) return false;
    const hasQuestion = !this.isCustomQuestion() || this.custom.value.length > 0;
    const hasAnswer = this.answer.value.length > 0;
    return hasQuestion && hasAnswer;
  };

  public render = () => {
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);

    // Only add the prompt to the first KBA question
    if (this.kbaIndex === 0) {
      const p = el<HTMLParagraphElement>('p');
      p.innerHTML = this.callback.getPrompt();
      formGroup.appendChild(p);
    }

    // Determine the list of options and selected index
    const predefinedQuestions = this.callback.getPredefinedQuestions();
    const questionText =
      (this.callback.getInputValue(0) as string) || predefinedQuestions[this.kbaIndex];
    const isCustomQuestion = !predefinedQuestions.includes(questionText);
    const allOptions = [...predefinedQuestions, TEXT.customLabel];
    const selectedIndex = allOptions.indexOf(isCustomQuestion ? TEXT.customLabel : questionText);

    // Add the dropdown
    const selectWrap = el<HTMLDivElement>('div', 'mb-1');
    this.select = el<HTMLSelectElement>('select', 'form-control custom-select');
    this.select.required = true;
    allOptions.forEach((x, i) => {
      const option = this.createOption(x, i === selectedIndex);
      this.select.appendChild(option);
    });
    this.select.addEventListener('change', this.onQuestionChange);
    selectWrap.appendChild(this.select);
    formGroup.appendChild(selectWrap);

    // Create the "custom question" input
    this.customWrap = el<HTMLDivElement>('div', 'form-label-group mb-1 d-none');
    this.custom = el<HTMLInputElement>('input', 'form-control');
    this.custom.id = `fr-callback-${this.index}-custom`;
    this.custom.type = 'text';
    this.custom.value = isCustomQuestion ? questionText : '';
    this.custom.addEventListener('keyup', this.onInput);
    this.customWrap.appendChild(this.custom);
    const customLabel = el<HTMLLabelElement>('label');
    customLabel.htmlFor = this.custom.id;
    customLabel.innerHTML = TEXT.customLabel;
    this.customWrap.appendChild(customLabel);
    formGroup.appendChild(this.customWrap);

    // Create an input for the answer
    const answerWrap = el<HTMLDivElement>('div', 'form-label-group mb-0');
    this.answer = el<HTMLInputElement>('input', 'form-control');
    this.answer.id = `fr-callback-${this.index}-answer`;
    this.answer.placeholder = TEXT.answerLabel;
    this.answer.type = 'text';
    this.answer.value = this.callback.getInputValue(1) as string;
    this.answer.addEventListener('keyup', this.onInput);
    answerWrap.appendChild(this.answer);
    const answerLabel = el<HTMLLabelElement>('label');
    answerLabel.htmlFor = this.answer.id;
    answerLabel.innerHTML = TEXT.answerLabel;
    answerWrap.appendChild(answerLabel);
    formGroup.appendChild(answerWrap);

    this.setView();

    return formGroup;
  };

  private createOption = (text: string, selected: boolean) => {
    const option = el<HTMLOptionElement>('option');
    option.value = text;
    option.text = text;
    option.selected = selected;
    return option;
  };

  private isCustomQuestion = () => {
    return this.select.value === TEXT.customLabel;
  };

  private onQuestionChange = () => {
    this.setView();
    this.onInput();
  };

  private setView = () => {
    if (this.isCustomQuestion()) {
      this.customWrap.classList.remove('d-none');
    } else {
      this.customWrap.classList.add('d-none');
    }
  };

  private onInput = () => {
    if (this.isCustomQuestion()) {
      this.callback.setQuestion(this.custom.value);
    } else {
      this.callback.setQuestion(this.select.value);
    }
    this.callback.setAnswer(this.answer.value);
    this.onChange(this);
  };
}

export default KbaCreateCallbackRenderer;
