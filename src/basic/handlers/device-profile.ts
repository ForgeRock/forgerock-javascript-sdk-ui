/*
 * @forgerock/javascript-sdk-ui
 *
 * device-profile.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { CallbackType, DeviceProfileCallback, FRStep, FRDevice } from '@forgerock/javascript-sdk';
import { FRUIStepHandler } from '../../interfaces';
import Deferred from '../../util/deferred';
import template from '../views/waiting.html';

class DeviceStepHandler implements FRUIStepHandler {
  private message!: HTMLDivElement;
  protected deferred: Deferred<FRStep>;

  constructor(private target: HTMLElement, private step: FRStep) {
    this.target.innerHTML = template;
    const messageDiv = this.target.querySelector<HTMLDivElement>('.fr-message');
    if (!messageDiv) {
      throw new Error(`Required targets not found in device handler view`);
    }

    this.message = messageDiv;
    this.deferred = new Deferred<FRStep>();
  }

  public completeStep = async (): Promise<FRStep> => {
    const deviceCollectorCb: DeviceProfileCallback = this.step.getCallbackOfType(
      CallbackType.DeviceProfileCallback,
    );

    this.message.innerHTML = deviceCollectorCb.getMessage();

    const isLocationRequired = deviceCollectorCb.isLocationRequired();
    const isMetadataRequired = deviceCollectorCb.isMetadataRequired();

    const device = new FRDevice();
    const profile = await device.getProfile({
      location: isLocationRequired,
      metadata: isMetadataRequired,
    });
    deviceCollectorCb.setProfile(profile);

    this.deferred.resolve(this.step);
    return this.deferred.promise;
  };
}

export default DeviceStepHandler;
