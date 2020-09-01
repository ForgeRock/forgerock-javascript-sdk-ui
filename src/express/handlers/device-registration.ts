/*
 * @forgerock/javascript-sdk-ui
 *
 * device-registration.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { FRWebAuthn } from '@forgerock/javascript-sdk';
import FRStepHandlerBase from '../../fr-step-handler-base';
import template from '../views/device-registration.html';

/**
 * Handler that renders a WebAuthn registration step in Express.
 */
class DeviceRegistrationStepHandler extends FRStepHandlerBase {
  private heading!: HTMLHeadingElement;

  /** @hidden */
  public retry = undefined;

  protected getRefs = (): void => {
    this.heading = this.findElement('h2');
  };

  protected render = (): void => {
    this.target.innerHTML = template;
    this.invokeWebAuthn();
  };

  protected invokeWebAuthn = async (): Promise<void> => {
    this.heading.innerHTML = 'Acquiring device credentials...';
    const result = await FRWebAuthn.register(this.step);
    this.deferred.resolve(result);
  };
}

export default DeviceRegistrationStepHandler;
