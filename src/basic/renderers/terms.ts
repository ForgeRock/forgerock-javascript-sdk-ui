/*
 * @forgerock/javascript-sdk-ui
 *
 * terms.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { TermsAndConditionsCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import {
  CallbackRenderer,
  DestroyableCallbackRenderer,
  FocusableCallbackRenderer,
} from '../interfaces';

/**
 * Renders the content of the Terms and Conditions, along with a labeled checkbox
 * that indicates agreement.
 */
class TermsAndConditionsCallbackRenderer
  implements DestroyableCallbackRenderer, FocusableCallbackRenderer {
  private input!: HTMLInputElement;

  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(
    private callback: TermsAndConditionsCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  /**
   * Removes event listeners.
   */
  public destroy = (): void => this.input.removeEventListener('change', this.onInput);

  /**
   * Sets the focus on the checkbox.
   */
  public focus = (): void => this.input.focus();

  /**
   * Returns true if the checkbox is checked.
   */
  public isValid = (): boolean => this.input && this.input.checked;

  /**
   * Creates all required DOM elements and returns the containing element.
   */
  public render = (): HTMLDivElement => {
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

  private onInput = (): void => {
    this.callback.setAccepted(this.input.checked);
    this.onChange(this);
  };
}

export default TermsAndConditionsCallbackRenderer;
