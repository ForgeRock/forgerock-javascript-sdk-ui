import { FRStep, FRRecoveryCodes } from '@forgerock/javascript-sdk';
import { FRUIStepHandler } from '../../interfaces';
import Deferred from '../../util/deferred';
import { el } from '../../util/dom';
import template from '../views/list.html';

class DisplayRecoveryCodesHandler implements FRUIStepHandler {
  private buttons!: HTMLDivElement;
  private header!: HTMLDivElement;
  private container!: HTMLDivElement;
  protected deferred: Deferred<FRStep>;

  constructor(private target: HTMLElement, private step: FRStep) {
    this.target.innerHTML = template;

    const buttonsEl = this.target.querySelector<HTMLDivElement>('.fr-buttons');
    const headerEl = this.target.querySelector<HTMLDivElement>('h1');
    const containerEl = this.target.querySelector<HTMLDivElement>('.fr-list-container');

    if (!buttonsEl || !headerEl || !containerEl) {
      throw new Error(`Required targets not found for display recovery codes handler view`);
    }

    this.buttons = buttonsEl;
    this.header = headerEl;
    this.container = containerEl;

    this.deferred = new Deferred<FRStep>();
  }

  public completeStep = (): Promise<FRStep> => {
    this.header.innerHTML = 'Your Recovery Codes';

    const recoveryCodes = FRRecoveryCodes.getCodes(this.step);
    const listHTML = recoveryCodes.reduce((prev: string, curr: string): string => {
      prev = `${prev}<li class="fr-recovery-code">${curr}</li>`;
      return prev;
    }, '');
    this.container.innerHTML = `
    <p>
      You must save a copy of these recovery codes. They cannot be displayed again.
    </p>
    <ul class="fr-list">
      ${listHTML}
    </ul>
    <p>
      Use one of these codes to authenticate if you lose your device
    </p>
    `;

    const button = el<HTMLButtonElement>('button', 'btn btn-primary');
    button.id = 'fr-submit';
    button.innerText = 'Next';
    button.addEventListener('click', () => this.deferred.resolve(this.step));
    this.buttons.appendChild(button);

    return this.deferred.promise;
  };
}

export default DisplayRecoveryCodesHandler;
