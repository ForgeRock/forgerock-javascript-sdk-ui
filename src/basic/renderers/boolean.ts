/*
 * @forgerock/javascript-sdk-ui
 *
 * boolean.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { AttributeInputCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import {
  CallbackRenderer,
  DestroyableCallbackRenderer,
  FocusableCallbackRenderer,
} from '../interfaces';
import { renderErrors } from './errors';

/**
 * Renders a labeled checkbox and any policy failure messages.
 */
class BooleanAttributeCallbackRenderer
  implements DestroyableCallbackRenderer, FocusableCallbackRenderer
{
  private input!: HTMLInputElement;

  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(
    private callback: AttributeInputCallback<boolean>,
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
   * Creates all required DOM elements and returns the containing element.
   */
  public render = (): HTMLDivElement => {
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

  private onInput = (): void => {
    this.callback.setValue(this.input.checked);
    this.onChange(this);
  };
}

export default BooleanAttributeCallbackRenderer;
