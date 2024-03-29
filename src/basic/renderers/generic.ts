/*
 * @forgerock/javascript-sdk-ui
 *
 * generic.ts
 *
 * Copyright (c) 2020-2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { FRCallback, PolicyRequirement } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import {
  CallbackRenderer,
  DestroyableCallbackRenderer,
  FocusableCallbackRenderer,
} from '../interfaces';
import { renderErrors } from './errors';

/**
 * Renders a labeled text input box and any policy failure messages.
 */
class GenericCallbackRenderer implements DestroyableCallbackRenderer, FocusableCallbackRenderer {
  private input!: HTMLInputElement;

  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(
    private callback: FRCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  /**
   * Removes event listeners.
   */
  public destroy = (): void => this.input.removeEventListener('keyup', this.onInput);

  /**
   * Sets the focus on the text input.
   */
  public focus = (): void => this.input.focus();

  /**
   * Returns true if the text input has a value.
   */
  public isValid = (): boolean => this.input && this.input.value.length > 0;

  /**
   * Creates all required DOM elements and returns the containing element.
   */
  public render = (): HTMLDivElement => {
    // Create basic structure
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group mb-3`);
    const formLabelGroup = el<HTMLDivElement>('div', 'form-floating form-label-group');
    formGroup.appendChild(formLabelGroup);

    // Add the input element
    this.input = el<HTMLInputElement>('input', 'form-control');
    this.input.id = `fr-callback-${this.index}`;

    if (this.callback.getType() === 'NumberAttributeInputCallback') {
      this.input.type = 'number';
    } else {
      this.input.type = 'text';
    }
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

  private onInput = (): void => {
    let val: string | number;

    if (this.callback.getType() === 'NumberAttributeInputCallback') {
      val = Number(this.input.value);
    } else {
      val = this.input.value;
    }
    this.callback.setInputValue(val);
    this.onChange(this);
  };
}

export default GenericCallbackRenderer;
