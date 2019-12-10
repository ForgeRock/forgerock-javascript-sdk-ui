import {
  Dispatcher,
  ErrorCode,
  FRAuth,
  FRLoginFailure,
  FRStep,
  StepType,
} from '@forgerock/javascript-sdk';
import basicStepHandlerFactory from './basic';
import { TARGET_ID } from './constants';
import { FREventType } from './enums';
import { FREndStep, FRUIOptions, FRUIStepHandler } from './interfaces';

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

  public getSession = async (): Promise<FREndStep> => {
    this.successfulStages = [];
    return this.nextStep();
  };

  public clearState = () => {
    return this;
  };

  private async nextStep(previousStep?: FRStep): Promise<FREndStep> {
    try {
      let thisStep = await FRAuth.next(previousStep);

      this.dispatchEvent({ step: thisStep, type: FREventType.StepChange });

      switch (thisStep.type) {
        case StepType.LoginSuccess:
          // Login successful
          return thisStep;

        case StepType.LoginFailure:
          // If the first step timed out, get a new authId and resubmit
          if (this.firstStepTimedOut(thisStep)) {
            previousStep!.payload.authId = await this.getNewFirstAuthId();
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
          this.handler = this.options.handlerFactory!(this.el, thisStep);
          if (!this.handler) {
            throw new Error('Handler factory failed to produce a handler');
          }
          thisStep = await this.handler.completeStep(thisStep);

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

  private firstStepTimedOut = (step: FRLoginFailure) => {
    const isFirstStep = this.successfulStages.length === 0;
    const isTimeoutError = step.getReason() === ErrorCode.Timeout;
    return isFirstStep && isTimeoutError;
  };

  private getNewFirstAuthId = async () => {
    const firstStep = await FRAuth.next();
    return firstStep.payload.authId;
  };
}

export default FRUI;
export { FRUIOptions };
