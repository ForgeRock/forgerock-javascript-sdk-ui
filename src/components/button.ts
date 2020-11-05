/*
 * @forgerock/javascript-sdk-ui
 *
 * button.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

class Button {
  private text: string;

  constructor(protected button: HTMLButtonElement) {
    this.text = button.innerHTML;
  }

  public enable = (): void => {
    this.button.innerHTML = this.text;
    this.button.disabled = false;
  };

  public disable = (text?: string): void => {
    this.button.innerHTML = text || 'Verifying...';
    this.button.disabled = true;
  };

  public bind = (onClick: OnClick): void => {
    this.button.addEventListener('click', onClick);
  };

  public unbind = (onClick: OnClick): void => {
    this.button.removeEventListener('click', onClick);
  };
}

type OnClick = (e: MouseEvent) => void | Promise<void>;

export default Button;
