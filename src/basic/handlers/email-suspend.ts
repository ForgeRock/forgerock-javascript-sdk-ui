import { CallbackType, SuspendedTextOutputCallback, FRStep } from '@forgerock/javascript-sdk';
import { FRUIStepHandler } from '../../interfaces';
import Deferred from '../../util/deferred';
import template from '../views/suspend.html';

class EmailSuspendHandler implements FRUIStepHandler {
  private header!: HTMLDivElement;
  private container!: HTMLDivElement;
  protected deferred: Deferred<FRStep>;

  constructor(private target: HTMLElement, private step: FRStep) {
    this.target.innerHTML = template;

    const headerEl = this.target.querySelector<HTMLDivElement>('h1');
    const containerEl = this.target.querySelector<HTMLDivElement>('.fr-message');

    if (!headerEl || !containerEl) {
      throw new Error(`Required targets not found for email suspend handler view`);
    }

    this.header = headerEl;
    this.container = containerEl;

    this.deferred = new Deferred<FRStep>();
  }

  public completeStep = (): Promise<FRStep> => {
    this.header.innerHTML = 'Verify Your Email Address';

    const suspendedTextCb: SuspendedTextOutputCallback = this.step.getCallbackOfType(
      CallbackType.SuspendedTextOutputCallback,
    );
    const suspendedText = suspendedTextCb.getMessage();
    this.container.innerHTML = `
    <p>${suspendedText}</p>
    <p>You may close this window.</p>
    `;

    return this.deferred.promise;
  };
}

export default EmailSuspendHandler;
