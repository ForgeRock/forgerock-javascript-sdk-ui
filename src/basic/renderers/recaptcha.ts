import { ReCaptchaCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';

class ReCaptchaCallbackRenderer implements CallbackRenderer {
  private container: HTMLDivElement;
  private result: string = '';

  constructor(
    private callback: ReCaptchaCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {
    this.container = el<HTMLDivElement>('div', 'g-recaptcha');
  }

  public isValid = () => this.result.length > 0;

  public render = () => {
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    formGroup.appendChild(this.container);
    return formGroup;
  };

  public onInjected = () => {
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

  private setResult = (result: string) => {
    this.result = result;
    this.callback.setResult(result);
    this.onChange(this);
  };
}

export default ReCaptchaCallbackRenderer;
