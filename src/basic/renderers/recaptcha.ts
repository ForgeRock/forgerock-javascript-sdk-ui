import { ReCaptchaCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';

/* eslint-disable max-len */
/**
 * Invokes the reCAPTCHA API, which should be added to the page as an external
 * script with explicit rendering enabled. Refer to the
 * [reCAPTCHA documentation](https://developers.google.com/recaptcha/docs/display#explicitly_render_the_recaptcha_widget)
 * for more information.
 */
/* eslint-enable max-len */
class ReCaptchaCallbackRenderer implements CallbackRenderer {
  private container: HTMLDivElement;
  private result = '';

  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(
    private callback: ReCaptchaCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {
    this.container = el<HTMLDivElement>('div', 'g-recaptcha');
  }

  /**
   * Returns true if a successful reCAPTCHA result has been captured.
   */
  public isValid = (): boolean => this.result.length > 0;

  /**
   * Creates all required DOM elements and returns the containing element.
   */
  public render = (): HTMLDivElement => {
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    formGroup.appendChild(this.container);
    return formGroup;
  };

  /**
   * Instructs reCAPTCHA to render its UI.
   */
  public onInjected = (): void => {
    if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') {
      return console.error('reCAPTCHA is not present');
    }

    window.grecaptcha.render(this.container, {
      callback: (result: string) => {
        this.setResult(result);
      },
      'expired-callback': () => {
        this.setResult('');
      },
      sitekey: this.callback.getSiteKey(),
    });
  };

  private setResult = (result: string): void => {
    this.result = result;
    this.callback.setResult(result);
    this.onChange(this);
  };
}

export default ReCaptchaCallbackRenderer;
