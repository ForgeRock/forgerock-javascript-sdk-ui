import { FRStep } from '@forgerock/javascript-sdk';
import { FRUIStepHandler } from './interfaces';
import Deferred from './util/deferred';

abstract class FRStepHandlerBase implements FRUIStepHandler {
  public retry?: () => Promise<FRStep>;
  protected deferred: Deferred<FRStep>;

  constructor(protected target: HTMLElement, protected step: FRStep) {
    this.deferred = new Deferred<FRStep>();
  }

  public completeStep = () => {
    this.render();
    this.getRefs();
    this.bind();
    this.ready();
    return this.deferred.promise;
  };

  protected bind = () => {};
  protected getRefs = () => {};
  protected getTemplate = () => '';
  protected ready = () => {};

  protected render = () => {
    this.target.innerHTML = this.getTemplate();
  };

  protected findElement = <T extends Element>(selector: string, required: boolean = true): T => {
    const el = this.target.querySelector<T>(selector);
    if (required && !el) {
      throw new Error(`Element "${selector}" not found`);
    }
    return el as T;
  };
}

export default FRStepHandlerBase;
