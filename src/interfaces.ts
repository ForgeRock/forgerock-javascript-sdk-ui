import { FRLoginFailure, FRLoginSuccess, FRStep } from '@forgerock/javascript-sdk';
import { FREventType } from './enums';

type FREndStep = FRLoginSuccess | FRLoginFailure;
type FRAnyStep = FRStep | FREndStep;

interface FRUIStepHandler {
  completeStep: (step: FRStep) => Promise<FRStep>;
  retry?: () => Promise<FRStep>;
}

interface FRUIStepHandlerFactory {
  (el: HTMLElement, step: FRStep): FRUIStepHandler | undefined;
}

interface FRUIOptions {
  handlerFactory?: FRUIStepHandlerFactory;
  targetId?: string;
}

interface FREvent {
  type: FREventType;
}

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
