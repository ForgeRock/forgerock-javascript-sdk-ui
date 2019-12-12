import { FRLoginFailure, FRLoginSuccess, FRStep } from '@forgerock/javascript-sdk';
import { FREventType } from './enums';

/**
 * Represents the final step type of authentication, which could be success or failure.
 */
type FREndStep = FRLoginSuccess | FRLoginFailure;

/**
 * Represents any step type of authentication, including the final step type.
 */
type FRAnyStep = FRStep | FREndStep;

/**
 * Represents a handler that can process a given authentication step.
 */
interface FRUIStepHandler {
  /**
   * Returns a Promise that resolves with the complete step, ready for submission.
   */
  completeStep: () => Promise<FRStep>;

  /**
   * Instructs the handler to adjust its UI to attempt to retry the step.
   */
  retry?: () => Promise<FRStep>;
}

/**
 * Represents a factory that returns a step handler given a specific step.
 */
interface FRUIStepHandlerFactory {
  (el: HTMLElement, step: FRStep): FRUIStepHandler | undefined;
}

/**
 * Options for creating a `FRUI` instance.
 */
interface FRUIOptions {
  handlerFactory?: FRUIStepHandlerFactory;
  targetId?: string;
}

/**
 * Represents an event dispatched by `FRUI`.
 */
interface FREvent {
  type: FREventType;
}

/**
 * Represents a "step change" event dispatched by `FRUI`.
 */
interface StepChangeEvent extends FREvent {
  step: FRStep;
}

export {
  FRAnyStep,
  FREndStep,
  FREvent,
  FRUIOptions,
  FRUIStepHandler,
  FRUIStepHandlerFactory,
  StepChangeEvent,
};
