/*
 * @forgerock/javascript-sdk-ui
 *
 * basic.ts
 *
 * Copyright (c) 2020-2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import {
  AttributeInputCallback,
  CallbackType,
  ChoiceCallback,
  ConfirmationCallback,
  DeviceProfileCallback,
  FRCallback,
  FRStep,
  KbaCreateCallback,
  PasswordCallback,
  PollingWaitCallback,
  ReCaptchaCallback,
  SelectIdPCallback,
  TermsAndConditionsCallback,
  TextOutputCallback,
  ValidatedCreatePasswordCallback,
} from '@forgerock/javascript-sdk';
import { FRUIStepHandler, FRRendererOptions } from '../../interfaces';
import Deferred from '../../util/deferred';
import { el } from '../../util/dom';
import {
  CallbackRenderer,
  CallbackRendererFactory,
  DestroyableCallbackRenderer,
  FocusableCallbackRenderer,
} from '../interfaces';
import BooleanAttributeCallbackRenderer from '../renderers/boolean';
import ChoiceCallbackRenderer from '../renderers/choice';
import ConfirmationCallbackRenderer from '../renderers/confirmation';
import DeviceProfileCallbackRenderer from '../renderers/device-profile';
import GenericCallbackRenderer from '../renderers/generic';
import KbaCreateCallbackRenderer from '../renderers/kba-create';
import PasswordCallbackRenderer from '../renderers/password';
import PollingWaitCallbackRenderer from '../renderers/polling-wait';
import ReCaptchaCallbackRenderer from '../renderers/recaptcha';
import SelectIdPCallbackRenderer from '../renderers/select-idp';
import TermsAndConditionsCallbackRenderer from '../renderers/terms';
import TextOutputCallbackRenderer from '../renderers/text';
import template from '../views/form.html';

/**
 * Handler that creates generic renderers for each supported callback.  This is the default
 * when creating a new `FRUI` instance.
 */
class BasicStepHandler implements FRUIStepHandler {
  private submit?: HTMLButtonElement;
  private container: HTMLDivElement;
  private renderers!: CallbackRenderer[];

  private callbacksThatDontRequireSubmitButton = [
    CallbackType.ConfirmationCallback,
    CallbackType.PollingWaitCallback,
    CallbackType.RedirectCallback,
    CallbackType.SelectIdPCallback,
  ];

  /**
   * The deferred Promise that resolves the step when it's ready to submit.
   */
  protected deferred: Deferred<FRStep>;

  /**
   * Creates a new BasicStepHandler object.
   *
   * @param target The HTML element to render callbacks into
   * @param step The step that contains callbacks to render
   * @param rendererFactory A factory to override rendering of specific callbacks
   */
  constructor(
    private target: HTMLElement,
    private step: FRStep,
    private rendererFactory?: CallbackRendererFactory,
    private rendererOptions?: FRRendererOptions,
  ) {
    this.container = el('div');
    this.container.innerHTML = template;
    this.deferred = new Deferred<FRStep>();
  }

  /**
   * Renders all callbacks in the step and returns a Promise that is resolved when the step is
   * ready to be submitted.
   */
  public completeStep = (): Promise<FRStep> => {
    // Start with the HTML template
    this.target.innerHTML = '';
    this.container = el('div');
    this.container.innerHTML = template;

    // Locate containers for input fields and buttons
    const formTarget = this.container.querySelector('.fr-form');
    const buttonTarget = this.container.querySelector('.fr-buttons');
    if (!formTarget || !buttonTarget) {
      throw new Error(`Required form targets not found in basic handler view`);
    }

    this.setHeader();
    this.setDescription();

    // Render callbacks
    this.renderers = this.createRenderers();
    this.renderers.forEach((x) => {
      formTarget.appendChild(x.render());
    });

    // Add everything to the DOM
    this.target.appendChild(this.container);

    // Focus on the first relevant callback
    const firstFocusable = this.renderers.find((x) => !!x.focus);
    if (firstFocusable !== undefined) {
      (firstFocusable as FocusableCallbackRenderer).focus();
    }

    // Notify renderers to perform any post-injection actions
    this.renderers.filter((x) => !!x.onInjected).forEach((x) => x.onInjected && x.onInjected());

    // Add the submit button if necessary
    if (this.requiresSubmitButton()) {
      this.submit = this.createSubmitButton();
      buttonTarget.appendChild(this.submit);
    }

    return this.deferred.promise;
  };

  private setHeader = (): void => {
    const h1 = this.container.querySelector('h1');
    if (h1) {
      h1.innerHTML = this.step.getHeader() || '';
    }
  };

  private setDescription = (): void => {
    const p = this.container.querySelector('p');
    if (p) {
      p.innerHTML = this.step.getDescription() || '';
    }
  };

  private createRenderers = (): CallbackRenderer[] => {
    const renderers = this.step.callbacks.map(this.createRenderer);
    return renderers;
  };

  private createRenderer = (cb: FRCallback, index: number): CallbackRenderer => {
    if (this.rendererFactory) {
      const renderer = this.rendererFactory(cb, index, this.step, this.onChange);
      if (renderer) return renderer;
    }

    switch (cb.getType()) {
      case CallbackType.BooleanAttributeInputCallback:
        const attrCallback = cb as AttributeInputCallback<boolean>;
        return new BooleanAttributeCallbackRenderer(attrCallback, index, this.onChange);

      case CallbackType.ChoiceCallback:
        const choiceCallback = cb as ChoiceCallback;
        return new ChoiceCallbackRenderer(choiceCallback, index, this.onChange);

      case CallbackType.ConfirmationCallback:
        return new ConfirmationCallbackRenderer(cb as ConfirmationCallback, index, this.onChange);

      case CallbackType.DeviceProfileCallback:
        return new DeviceProfileCallbackRenderer(cb as DeviceProfileCallback, this.onChange);

      case CallbackType.KbaCreateCallback:
        const kbaCreateCallback = cb as KbaCreateCallback;
        const kbaIndex = this.step
          .getCallbacksOfType<KbaCreateCallback>(CallbackType.KbaCreateCallback)
          .filter((x) => x.getPrompt() === kbaCreateCallback.getPrompt())
          .indexOf(kbaCreateCallback);
        return new KbaCreateCallbackRenderer(kbaCreateCallback, index, kbaIndex, this.onChange);

      case CallbackType.PasswordCallback:
        return new PasswordCallbackRenderer(cb as PasswordCallback, index, this.onChange);

      case CallbackType.PollingWaitCallback:
        return new PollingWaitCallbackRenderer(cb as PollingWaitCallback, index, this.onChange);

      case CallbackType.ReCaptchaCallback:
        return new ReCaptchaCallbackRenderer(cb as ReCaptchaCallback, index, this.onChange);

      case CallbackType.SelectIdPCallback:
        /**
         * If either of the username collection callbacks are present,
         * we assume a local authentication form is present
         */
        const hasLocalAuthForm =
          !!this.step.getCallbacksOfType(CallbackType.NameCallback).length ||
          !!this.step.getCallbacksOfType(CallbackType.ValidatedCreateUsernameCallback).length;

        return new SelectIdPCallbackRenderer(
          cb as SelectIdPCallback,
          index,
          this.onChange,
          hasLocalAuthForm,
        );

      case CallbackType.TermsAndConditionsCallback:
        const termsCallback = cb as TermsAndConditionsCallback;
        return new TermsAndConditionsCallbackRenderer(termsCallback, index, this.onChange);

      case CallbackType.TextOutputCallback:
        return new TextOutputCallbackRenderer(
          cb as TextOutputCallback,
          index,
          this.rendererOptions?.dangerouslySetScriptText || false,
        );

      case CallbackType.ValidatedCreatePasswordCallback:
        const passwordCallback = cb as ValidatedCreatePasswordCallback;
        return new PasswordCallbackRenderer(passwordCallback, index, this.onChange);

      default:
        return new GenericCallbackRenderer(cb, index, this.onChange);
    }
  };

  private onChange = (renderer?: CallbackRenderer): void => {
    const callbacks = this.step.callbacks;
    const rendererClassname = renderer?.constructor.name;
    const pollingWaitCb = callbacks.find(
      (x: FRCallback) => x.getType() === CallbackType.PollingWaitCallback,
    );

    /**
     * A confirmation callback with a single value has a specific meaning
     * that we need to handle.
     * To allow the use of `getOptions`, the use of any is needed
     */
    // eslint-disable-next-line
    const singleValueConfirmation = callbacks.find((x: any) => {
      return x.getOptions && x.getOptions().length === 1;
    });

    /**
     * A SelectIdPCallback with local authentication form is a special combo
     */
    const socialLoginWithLocal = (): boolean => {
      let hasSelectIdP = false;
      let hasLocalForm = false;

      callbacks.forEach((x: FRCallback) => {
        switch (x.getType()) {
          case CallbackType.SelectIdPCallback:
            hasSelectIdP = true;
            break;
          case CallbackType.NameCallback:
            hasLocalForm = true;
            break;
          case CallbackType.ValidatedCreateUsernameCallback:
            hasLocalForm = true;
            break;
          default:
          // Intentionally left empty
        }
      });

      return hasSelectIdP && hasLocalForm;
    };

    if (socialLoginWithLocal() && rendererClassname !== 'SelectIdPCallbackRenderer') {
      /**
       * If Local Authentication form is combined with Social Login Providers, and
       * local inputs are used, this signals the use of the local auth, so set
       * localAuthentication as provider on the SelectIdPCallback before resolving
       */
      const selectIdPRenderer = this.renderers.find((x) => {
        return x.constructor.name === 'SelectIdPCallbackRenderer';
      });
      // eslint-disable-next-line
      // @ts-ignore
      selectIdPRenderer.onOtherInput('localAuthentication');
    }

    // If any renderer has an invalid value (input value length of 0), this will be false
    const isValid = this.isValid();
    // Enables or disables button according to validity of renderer values
    this.setSubmitButton(isValid);

    /**
     * If Polling Wait is "exitable", it will come with a confirmation callback
     * that has only one value. We don't want to block the autosubmission of
     * the Polling Wait if it is exitable.
     *
     * Otherwise, automatically resolve/submit if there's no submit button,
     * and all other renders are valid, and a callback change occurs.
     */
    if (callbacks.length === 2 && pollingWaitCb && singleValueConfirmation) {
      this.resolve();
    } else if (!this.submit && isValid) {
      this.resolve();
    } else if (rendererClassname === 'SelectIdPCallbackRenderer') {
      this.resolve();
    }
  };

  private requiresSubmitButton = (): boolean => {
    const cbsNotNeedingSubmitBtn = this.step.callbacks.filter((x) =>
      this.callbacksThatDontRequireSubmitButton.includes(x.getType() as CallbackType),
    );
    const confirmationCbs = cbsNotNeedingSubmitBtn.filter(
      (x: FRCallback) => x.getType() === CallbackType.ConfirmationCallback,
    );
    const hasMultipleRenderers = this.renderers.length > 1;

    if (cbsNotNeedingSubmitBtn.length && hasMultipleRenderers) {
      /**
       * If ConfirmationCallback is present among others, return false.
       * If any other *callback not requiring a submit button* is present,
       * but if it's one of other callbacks, return true, which results
       * in rendering a submit button.
       */
      return !confirmationCbs.length;
    } else {
      /**
       * If there's a single callback not needing a submit button,
       * return false. If there are no callbacks NOT needing a submit
       * button, return true, which results in the rendering of a
       * submit button.
       */
      return !cbsNotNeedingSubmitBtn.length;
    }
  };

  private createSubmitButton = (): HTMLButtonElement => {
    const button = el<HTMLButtonElement>('button', 'btn btn-primary');
    button.disabled = !this.isValid();
    button.id = 'fr-submit';
    button.innerText = 'Next';
    button.addEventListener('click', () => {
      this.resolve();
    });
    return button;
  };

  private isValid = (): boolean => {
    /**
     * 1. Detect if the renderer itself, not this class, has an `isValid` method
     * 2. If it doesn't have the above method, `isInvalid` results in false
     * 3. If it does have an `isValid` method, run it
     * 4. If the value is valid, set to true then flip it with `!` to false, so `isInvalid` is false
     * 5. The one way `isInvalid` is true is if the renderer has isValid and the value's length is 0
     */
    const isInvalid = (x: CallbackRenderer): boolean => x.isValid !== undefined && !x.isValid();
    // Iterate through the renderers, if there is one invalid value return true, then flip to false
    return !this.renderers.some(isInvalid);
  };

  private setSubmitButton = (isValid?: boolean): void => {
    if (this.submit) {
      this.submit.disabled = isValid !== undefined ? !isValid : !this.isValid();
    }
  };

  private resolve = (): void => {
    // Continue with cleaning up and resolving step
    this.renderers
      .filter((x) => !!x.destroy)
      .forEach((x) => (x as DestroyableCallbackRenderer).destroy());

    if (this.submit) {
      this.submit.disabled = true;
      this.submit.removeEventListener('click', this.resolve);
    }

    this.deferred.resolve(this.step);
  };
}

export default BasicStepHandler;
