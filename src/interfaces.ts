/*
 * @forgerock/javascript-sdk-ui
 *
 * interfaces.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { FRLoginFailure, FRLoginSuccess, FRStep } from '@forgerock/javascript-sdk';
import { FREventType } from './enums';
import { CallbackRendererFactory } from './basic/interfaces';

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
  (
    el: HTMLElement,
    step: FRStep,
    rendererFactory?: CallbackRendererFactory,
    rendererOptions?: FRRendererOptions,
  ): FRUIStepHandler | undefined;
}

/**
 * Options for creating a `FRUI` instance.
 */
interface FRUIOptions {
  handlerFactory?: FRUIStepHandlerFactory;
  targetId?: string;
  rendererOptions?: FRRendererOptions;
}

/**
 * Represents an event dispatched by `FRUI`.
 */
interface FREvent {
  type: FREventType;
}

/**
 * Allows for configuring the behavior of the renderers
 */
interface FRRendererOptions {
  /**
   * Allows the SDK to handle TextOutputCallback messageType 4.
   * This is considered an advanced callback that can have dangerous
   * implications if not used carefully and correctly.
   * DO NOT ENABLE THIS if you are not sure.
   */
  dangerouslySetScriptText?: boolean;
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
  FRRendererOptions,
  FRUIOptions,
  FRUIStepHandler,
  FRUIStepHandlerFactory,
  StepChangeEvent,
};
