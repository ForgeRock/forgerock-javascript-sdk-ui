/*
 * @forgerock/javascript-sdk-ui
 *
 * fr-ui.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import {
  Dispatcher,
  ErrorCode,
  FRAuth,
  FRLoginFailure,
  FRStep,
  StepType,
} from '@forgerock/javascript-sdk';
import { ConfigOptions } from './index';
import basicStepHandlerFactory from './basic';
import { TARGET_ID } from './constants';
import { FREventType } from './enums';
import { FREndStep, FRUIOptions, FRUIStepHandler } from './interfaces';

/**
 * Orchestrates the flow through an authentication tree using `FRAuth`, generating
 * a handler for each step using the default or provided handler factory.
 *
 * Example:
 *
 * ```js
 * const ui = new forgerock.FRUI();
 * const result = await ui.getSession();
 * ```
 */
class FRUI extends Dispatcher {
  private el: HTMLElement;
  private options: FRUIOptions = {
    handlerFactory: basicStepHandlerFactory,
    targetId: TARGET_ID,
  };
  private handler: FRUIStepHandler | undefined;
  private successfulStages: FRStep[] = [];

  constructor(options: FRUIOptions) {
    super();

    Object.assign(this.options, options);

    // Ensure we have a handler factory
    if (typeof this.options.handlerFactory !== 'function') {
      throw new Error('No step handler factory is specified');
    }

    // Ensure we have a valid target
    const targetId = this.options.targetId || TARGET_ID;
    const el = document.getElementById(targetId);
    if (el === null) {
      throw new Error(`No element with id "${targetId}" found`);
    }
    this.el = el;
  }

  /**
   * Completes an authentication tree and returns the success or failure response.
   *
   * @param options Default configuration overrides
   */
  public getSession = async (options?: ConfigOptions): Promise<FREndStep> => {
    this.successfulStages = [];
    return this.nextStep(undefined, options);
  };

  /**
   * Reserved for future use.  Returns the current instance of FRUI for chaining.
   */
  public clearState = (): FRUI => {
    return this;
  };

  private async nextStep(previousStep?: FRStep, options?: ConfigOptions): Promise<FREndStep> {
    try {
      let thisStep = await FRAuth.next(previousStep, options);

      this.dispatchEvent({ step: thisStep, type: FREventType.StepChange });

      switch (thisStep.type) {
        case StepType.LoginSuccess:
          // Login successful
          return thisStep;

        case StepType.LoginFailure:
          // If the first step timed out, get a new authId and resubmit
          if (previousStep && this.firstStepTimedOut(thisStep)) {
            previousStep.payload.authId = await this.getNewFirstAuthId();
            return this.nextStep(previousStep);
          }

          // If the handler supports retry, give it a shot
          if (this.handler && this.handler.retry) {
            previousStep = await this.handler.retry();
            return this.nextStep(previousStep);
          }

          // Login failed
          return thisStep;

        default:
          if (previousStep) {
            this.successfulStages.push(previousStep);
          }

          // Get a handler for this step and use it to complete the step
          if (!this.options.handlerFactory) {
            throw new Error('No handler factory is configured');
          }
          this.handler = this.options.handlerFactory(this.el, thisStep);
          if (!this.handler) {
            throw new Error('Handler factory failed to produce a handler');
          }
          thisStep = await this.handler.completeStep();

          // Keep going to the next step
          return this.nextStep(thisStep);
      }
    } catch (error) {
      this.dispatchEvent({ step: previousStep, type: FREventType.StepError, error });
      const failure = new FRLoginFailure({
        code: 0,
        detail: undefined,
        message: error.message || 'Unknown',
        reason: 'Unknown',
      });
      return failure;
    }
  }

  private firstStepTimedOut = (step: FRLoginFailure): boolean => {
    const isFirstStep = this.successfulStages.length === 0;
    const isTimeoutError = step.getReason() === ErrorCode.Timeout;
    return isFirstStep && isTimeoutError;
  };

  private getNewFirstAuthId = async (): Promise<string | undefined> => {
    const firstStep = await FRAuth.next();
    return firstStep.payload.authId;
  };
}

export default FRUI;
export { FRUIOptions };
