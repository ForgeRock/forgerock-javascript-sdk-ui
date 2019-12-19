import { TextOutputCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';

/**
 * Renders the content of the Terms and Conditions, along with a labeled checkbox
 * that indicates agreement.
 */
class TextOutputCallbackRenderer {
  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(private callback: TextOutputCallback, private index: number) {}

  /**
   * Creates all required DOM elements and returns the containing element.
   */
  public render = (): HTMLDivElement => {
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);

    // Add the message
    const p = el<HTMLParagraphElement>('p');
    p.innerHTML = this.callback.getMessage();
    formGroup.appendChild(p);

    return formGroup;
  };
}

export default TextOutputCallbackRenderer;
