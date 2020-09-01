/*
 * @forgerock/javascript-sdk-ui
 *
 * polling-wait.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { PollingWaitCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';

/**
 * Renders no visible elements.  Automatically triggers a "change" event after the
 * callback's wait time.
 */
class PollingWaitCallbackRenderer implements CallbackRenderer {
  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(
    private callback: PollingWaitCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  /**
   * Creates all required DOM elements and returns the containing element.
   */
  public render = (): HTMLDivElement => {
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    formGroup.innerHTML = this.callback.getMessage();
    return formGroup;
  };

  /**
   * Starts the timeout after which `onChange` will be called.
   */
  public onInjected = (): void => {
    const waitTime = this.callback.getWaitTime();
    window.setTimeout(() => this.onChange(this), waitTime);
  };
}

export default PollingWaitCallbackRenderer;
