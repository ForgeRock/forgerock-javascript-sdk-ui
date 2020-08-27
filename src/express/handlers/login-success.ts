/*
 * @forgerock/javascript-sdk-ui
 *
 * login-success.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import FRStepHandlerBase from '../../fr-step-handler-base';
import template from '../views/login-success.html';

/**
 * Handler that renders a successful authentication in Express.
 */
class LoginSuccessStepHandler extends FRStepHandlerBase {
  /** @hidden */
  public retry = undefined;

  protected getTemplate = (): string => {
    return template;
  };

  /**
   * Resolves the handler's Promise immediately.
   */
  protected ready = (): void => this.deferred.resolve(this.step);
}

export default LoginSuccessStepHandler;
