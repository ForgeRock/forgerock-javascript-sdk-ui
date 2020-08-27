/*
 * @forgerock/javascript-sdk-ui
 *
 * enums.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/**
 * The types of events raised during authentication.
 */
enum FREventType {
  StepChange = 'step_change',
  StepError = 'step_error',
}

export { FREventType };
