import { PollingWaitCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import { CallbackRenderer } from '../interfaces';

class PollingWaitCallbackRenderer implements CallbackRenderer {
  constructor(
    private callback: PollingWaitCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  public render = () => {
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    formGroup.innerHTML = this.callback.getMessage();
    return formGroup;
  };

  public onInjected = () => {
    const waitTime = this.callback.getWaitTime();
    window.setTimeout(() => this.onChange(this), waitTime);
  };
}

export default PollingWaitCallbackRenderer;
