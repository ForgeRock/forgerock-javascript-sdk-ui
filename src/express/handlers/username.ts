/*
 * @forgerock/javascript-sdk-ui
 *
 * username.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { CallbackType, FRStep } from '@forgerock/javascript-sdk';
import Button from '../../components/button';
import FRStepHandlerBase from '../../fr-step-handler-base';
import Deferred from '../../util/deferred';
import template from '../views/username.html';

/**
 * Handler that renders an input for username in an Express step.
 */
class UsernameStepHandler extends FRStepHandlerBase {
  private username!: HTMLInputElement;
  private retryMessage!: HTMLParagraphElement;
  private submit!: Button;

  /**
   * Displays a retry message and enables the submit button.
   */
  public retry = (): Promise<FRStep> => {
    this.deferred = new Deferred<FRStep>();
    this.retryMessage.style.display = 'block';
    this.submit.enable();
    this.bind();
    return this.deferred.promise;
  };

  protected bind = (): void => {
    this.submit.bind(this.onSubmit);
  };

  protected unbind = (): void => {
    this.submit.unbind(this.onSubmit);
  };

  protected getRefs = (): void => {
    this.retryMessage = this.findElement('.fr-retry');
    this.submit = new Button(this.findElement('.btn-primary'));
    this.username = this.findElement('#fr-username');
  };

  protected getTemplate = (): string => {
    return template;
  };

  protected ready = (): void => {
    this.username.focus();
  };

  protected onSubmit = (): void => {
    this.submit.disable();
    this.step.setCallbackValue(CallbackType.NameCallback, this.username.value);
    this.unbind();
    this.deferred.resolve(this.step);
  };
}

export default UsernameStepHandler;
