/*
 * @forgerock/javascript-sdk-ui
 *
 * fr-step-handler-base.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { FRStep } from '@forgerock/javascript-sdk';
import { FRUIStepHandler } from './interfaces';
import Deferred from './util/deferred';

/**
 * Base handler implementation that orchestrates rendering, binding, readiness, etc. Subclasses
 * can override only the methods that require customization.
 */
abstract class FRStepHandlerBase implements FRUIStepHandler {
  /**
   * Performs handler-specific retry actions.
   */
  public retry?: () => Promise<FRStep>;

  /**
   * The deferred Promise that resolves the step when it's ready to submit.
   */
  protected deferred: Deferred<FRStep>;

  /**
   * Instantiates a new handler.
   *
   * @param target The DOM element to contain the handler
   * @param step The step to handle
   */
  constructor(protected target: HTMLElement, protected step: FRStep) {
    this.deferred = new Deferred<FRStep>();
  }

  /**
   * Initializes the handler and returns a Promise that will resolve with
   * the complete step when it's ready to submit.
   */
  public completeStep = (): Promise<FRStep> => {
    this.render();
    this.getRefs();
    this.bind();
    this.ready();
    return this.deferred.promise;
  };

  /**
   * Perform any handler-specific event binding required.
   */
  protected bind = (): void => {
    return;
  };

  /**
   * Capture references to handler-specific DOM elements.
   */
  protected getRefs = (): void => {
    return;
  };

  /**
   * Return the handler-specific HTML template.
   */
  protected getTemplate = (): string => '';

  /**
   * Perform any required action after the handler's template has been rendered.
   */
  protected ready = (): void => {
    return;
  };

  /**
   * Render the handler's template to the target.
   */
  protected render = (): void => {
    this.target.innerHTML = this.getTemplate();
  };

  /**
   * Helper for locating a DOM element within the target.
   */
  protected findElement = <T extends Element>(selector: string, required = true): T => {
    const el = this.target.querySelector<T>(selector);
    if (required && !el) {
      throw new Error(`Element "${selector}" not found`);
    }
    return el as T;
  };
}

export default FRStepHandlerBase;
