/*
 * @forgerock/javascript-sdk-ui
 *
 * password.ts
 *
 * Copyright (c) 2020-2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { PasswordCallback, ValidatedCreatePasswordCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import {
  CallbackRenderer,
  DestroyableCallbackRenderer,
  FocusableCallbackRenderer,
} from '../interfaces';
import { renderErrors } from './errors';

/**
 * Renders a labeled password input box and any policy failure messages.  The password
 * input box contains a toggle button to hide/show the password.
 */
class PasswordCallbackRenderer implements DestroyableCallbackRenderer, FocusableCallbackRenderer {
  private input!: HTMLInputElement;
  private toggle!: HTMLButtonElement;

  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(
    private callback: PasswordCallback | ValidatedCreatePasswordCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  /**
   * Removes event listeners.
   */
  public destroy = (): void => {
    this.input.removeEventListener('keyup', this.onInput);
    this.toggle.removeEventListener('click', this.toggleView);
  };

  /**
   * Sets the focus on the password input.
   */
  public focus = (): void => this.input.focus();

  /**
   * Returns true if the password input has a value.
   */
  public isValid = (): boolean => this.input && this.input.value.length > 0;

  /**
   * Creates all required DOM elements and returns the containing element.
   */
  public render = (): HTMLDivElement => {
    // Create the basic structure
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group mb-3`);
    const formLabelGroup = el<HTMLDivElement>(
      'div',
      'form-floating form-label-group input-group form-label-group-password',
    );
    formGroup.appendChild(formLabelGroup);

    // Add the input
    this.input = el<HTMLInputElement>('input', 'form-control rounded-end input-password');
    this.input.id = `fr-callback-${this.index}`;
    this.input.addEventListener('keyup', this.onInput);
    formLabelGroup.appendChild(this.input);

    // Add the prompt
    const prompt = this.callback.getPrompt();
    if (prompt) {
      this.input.placeholder = prompt;
      const label = el<HTMLLabelElement>('label');
      label.innerHTML = prompt;
      label.htmlFor = this.input.id;
      formLabelGroup.appendChild(label);
    }

    // Add the view/hide toggle
    this.toggle = el<HTMLButtonElement>('button', 'toggle-password');
    this.toggle.type = 'button';
    this.toggle.setAttribute('aria-label', 'Display password in plain text.');
    this.toggle.addEventListener('click', this.toggleView);
    formLabelGroup.appendChild(this.toggle);

    // Add policy errors
    const errorList = renderErrors(this.callback.getFailedPolicies(), prompt);
    if (errorList) {
      formGroup.appendChild(errorList);
    }

    this.setView(false);

    return formGroup;
  };

  private setView = (showPassword: boolean): void => {
    this.input.type = showPassword ? 'text' : 'password';
  };

  private toggleView = (): void => {
    this.setView(this.input.type === 'password');
  };

  private onInput = (): void => {
    this.callback.setPassword(this.input.value);
    this.onChange(this);
  };
}

export default PasswordCallbackRenderer;
