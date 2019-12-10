import {
  AttributeInputCallback,
  CallbackType,
  ChoiceCallback,
  ConfirmationCallback,
  FRCallback,
  FRStep,
  KbaCreateCallback,
  PasswordCallback,
  PollingWaitCallback,
  ReCaptchaCallback,
  TermsAndConditionsCallback,
} from '@forgerock/javascript-sdk';
import { FRUIStepHandler } from '../../interfaces';
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
import GenericCallbackRenderer from '../renderers/generic';
import KbaCreateCallbackRenderer from '../renderers/kba-create';
import PasswordCallbackRenderer from '../renderers/password';
import PollingWaitCallbackRenderer from '../renderers/polling-wait';
import ReCaptchaCallbackRenderer from '../renderers/recaptcha';
import TermsAndConditionsCallbackRenderer from '../renderers/terms';
import template from '../views/form.html';

class BasicStepHandler implements FRUIStepHandler {
  private submit?: HTMLButtonElement;
  private container: HTMLDivElement;
  private renderers!: CallbackRenderer[];

  protected deferred: Deferred<FRStep>;

  constructor(
    private target: HTMLElement,
    private step: FRStep,
    private rendererFactory?: CallbackRendererFactory,
  ) {
    this.container = el('div');
    this.container.innerHTML = template;
    this.deferred = new Deferred<FRStep>();
  }

  private callbacksThatDontRequireSubmitButton = [
    CallbackType.ConfirmationCallback,
    CallbackType.PollingWaitCallback,
    // TODO: Update when core SDK supports this callback type
    'RedirectCallback',
  ];

  public completeStep = (step: FRStep) => {
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

    // Add the submit button if necessary
    if (this.requiresSubmitButton()) {
      this.submit = this.createSubmitButton();
      buttonTarget.appendChild(this.submit);
    }

    // Render callbacks
    this.renderers = this.createRenderers(step);
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

    return this.deferred.promise;
  };

  public retry?: () => Promise<FRStep>;

  private setHeader = () => {
    const h1 = this.container.querySelector('h1');
    if (h1) {
      h1.innerHTML = this.step.getHeader() || '';
    }
  };

  private createRenderers = (step: FRStep) => {
    const renderers = step.callbacks.map((x, i) => this.createRenderer(x, i, step));
    return renderers;
  };

  private createRenderer = (cb: FRCallback, index: number, step: FRStep) => {
    if (this.rendererFactory) {
      const renderer = this.rendererFactory(cb, index, step, this.onChange);
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

      case CallbackType.PasswordCallback:
      case CallbackType.ValidatedCreatePasswordCallback:
        return new PasswordCallbackRenderer(cb as PasswordCallback, index, this.onChange);

      case CallbackType.PollingWaitCallback:
        return new PollingWaitCallbackRenderer(cb as PollingWaitCallback, index, this.onChange);

      case CallbackType.ReCaptchaCallback:
        return new ReCaptchaCallbackRenderer(cb as ReCaptchaCallback, index, this.onChange);

      case CallbackType.TermsAndConditionsCallback:
        const termsCallback = cb as TermsAndConditionsCallback;
        return new TermsAndConditionsCallbackRenderer(termsCallback, index, this.onChange);

      case CallbackType.KbaCreateCallback:
        const kbaCreateCallback = cb as KbaCreateCallback;
        const kbaIndex = step
          .getCallbacksOfType<KbaCreateCallback>(CallbackType.KbaCreateCallback)
          .filter((x) => x.getPrompt() === kbaCreateCallback.getPrompt())
          .indexOf(kbaCreateCallback);
        return new KbaCreateCallbackRenderer(kbaCreateCallback, index, kbaIndex, this.onChange);

      default:
        return new GenericCallbackRenderer(cb, index, this.onChange);
    }
  };

  private onChange = () => {
    const isInvalid = (x: CallbackRenderer) => {
      return x.isValid !== undefined && !x.isValid();
    };
    const someInvalid = this.renderers.some(isInvalid);

    if (this.submit) {
      this.submit.disabled = someInvalid;
    } else if (!someInvalid) {
      this.resolve();
    }
  };

  private requiresSubmitButton = () => {
    const intersection = this.step.callbacks.filter((x) =>
      this.callbacksThatDontRequireSubmitButton.includes(x.getType()),
    );
    return intersection.length === 0;
  };

  private createSubmitButton = () => {
    const button = el<HTMLButtonElement>('button', 'btn btn-primary');
    button.disabled = true;
    button.innerText = 'Next';
    button.addEventListener('click', this.resolve);
    return button;
  };

  private resolve = () => {
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
