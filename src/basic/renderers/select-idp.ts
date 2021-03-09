/*
 * @forgerock/javascript-sdk-ui
 *
 * select-idp.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Config, SelectIdPCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import {
  CallbackRenderer,
  DestroyableCallbackRenderer,
  FocusableCallbackRenderer,
} from '../interfaces';

/** @hidden */
interface SelectIdPButton {
  element: HTMLButtonElement;
  handler: (e: MouseEvent) => void;
}

/**
 * Renders a message and a set of buttons, one for each option in the callback.
 */
class SelectIdPCallbackRenderer implements DestroyableCallbackRenderer, FocusableCallbackRenderer {
  private buttons!: SelectIdPButton[];
  private wasChosen = false;

  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(
    private callback: SelectIdPCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
    private hasLocalAuthForm: boolean,
  ) {}

  /**
   * Removes event listeners.
   */
  public destroy = (): void => {
    this.buttons.forEach((x) => x.element.removeEventListener('click', x.handler));
    this.buttons = [];
  };

  /**
   * Sets the focus on the first button.
   */
  public focus = (): void => this.buttons[0].element.focus();

  /**
   * This forces the submission of the step, regardless of context
   */
  public forceSubmit = (): boolean => true;

  /**
   * Returns true if one of the buttons was clicked.
   */
  public isValid = (): boolean => this.wasChosen;

  /**
   * Creates all required DOM elements and returns the containing element.
   */
  public render = (): HTMLDivElement => {
    const { serverConfig } = Config.get();
    const providers = this.callback.getProviders();
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    const styleEl = el<HTMLButtonElement>('style');

    const cssStr = providers.reduce(
      (prev, curr) => {
        if (curr.uiConfig) {
          const { buttonCustomStyle, buttonCustomStyleHover } = curr.uiConfig;

          prev = `
            ${prev}
            .btn-social-${curr.provider} {
              ${buttonCustomStyle}
            }
            .btn-social-${curr.provider}:hover {
              ${buttonCustomStyleHover}
            }
          `;
        }
        return prev;
      },
      `
        .btn-social > * {
          display: inline-block;
          vertical-align: middle;
        }
      `,
    );

    const getFallbackImage = (provider: string): string | void => {
      switch (provider) {
        case 'apple':
          // eslint-disable-next-line
          return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAABIxJREFUWAnFmM+rVVUUx9/1vadJqYgSWgNTMkqapYMGzRwpOKiBhOSkQWDafyDSoJkEIqQJITpSIWgWlbyHg8JJA4UiHfjQSpEUSsUfqe/5+e6zvsd9jufeo897dMH3rr3X3nut7177xznnjox0JDMzM2Nyje6BLeAncBLMt72j0O1uIWFy71H+A1j+pjD3uRKEgMltNSv0zShPBLk57dPsoEdGbn1G7i7l/6O+MwiOdxB+sEsI9CL4PMoXgpDITUdZJFdEn2efQYKnrKC3B6E7oW+F/iLIPfvs5VmBzC9B6DbaJCfVR4ItZbqoDflXzsEcMBrwslovxn4F5PIdlXlBTss/Boa7xDgUoXQ663OOgL46VlC3/Ebh43p/12nTZMelbWvSAxtj8Giv17unwXKI0kZfAO6AP2m7jk5C+0IK74JL2E8X1jTuTcqvAU3kGjhP+xQ6CePGqKcYtrVqBmkpvXRvUd4PpsA9YLlM4SjYCCqbn/rr4HNwCtwHuehE/wp2gFGRQTeuUCNROpd7hPIuUBdfHbn9HJW9YCeYBHVSmpiunbr9LLZ3gmQi20jKRjqXy075CLDoRMp5Tk51ZSPPKtVS+rXJh8b4lKu+/rFI0tEpP0BZousiJ5WMDT8mK1L5Bd3QtWLyY/AfrD7tZZKcuKTp4Ofo5nChYF2KJiK5CtZFBsvtpXrJlA4cJJ38RPIsbSvBfdC+L+g0C5lmjMjcBOuI/TuxdWMoZik5WxP5gFaRuwtsKwcMsTATvrYGuRfq5NSeE/SA92Ngmd2oD1PpztPkj0PqW60a+nZTgESQDrT3tMl1l62Njl0SNJev22I5gybzCgNebRtk77PU2ns6jLfAyfBR2XdhS6pOUI+wdNTRJp33H0bZW+kKzgSJbUUt+zVBm7o8FI5hrX2obA6UOsG+Mxno5ckavTJ6sXgxhtr2iCcTNDGdpNZZPeLlyQwio3hLwKoY2kow+o1cpfBfVEzabcPSIuNXq43htO/WqmSQq0YEL8SgrgjKvQl9ytX2EnH1SLUtwhcqEaQD7eX72Kno0SVBxVUWXwYHHK+JpDOoPt4HJ2JA10p3oUh+CLHdJGka6GGRc3rIwQ3olcBvMY/zmkX3WYvfC+VAj7ylYoR2sh4SjIbEng4TQOLXoaLW3a8Toi/CZTmXejpdP1Sl3nnNcS8S6XJES2fADWbgZ+IxDH8B7ZOu70XFdow9cWDHpdVQIZg16kG+Rx0Q31lFbfi/Soreos6Dw+G+f0z2QNqgaH1UTwFJv4+iovXpfr3/PhI5XFU+X4NwVdFJS6vOmyJ2V4fF5CYjXmVFq6xqtYzkwSDpT8SoPrXSnSeRXh0EG58mNWpFlUFpNmgt9Rkg6UdSQZRlZSSHtkbTXSqbfX0S5NqXts4UJ17qVZSvA4m+k0UoJyV7P1E/kRZZl720XwW5vplrvrEzpjjVkVd23sb8I1ieNbt4g8IP4GfwL9DE3gAbwBrQJPvwu00N+KZYXCtNHVttOHAmF1H+EpwDl8AE+Aw0kU5+adP/1d8AffdOge/BJgelPDBJDwD0fVGbxIXL3QAAAABJRU5ErkJggg==';
        case 'facebook':
          // eslint-disable-next-line
          return 'data:image/png;base64,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';
        case 'google':
          // eslint-disable-next-line
          return 'data:image/png;base64,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';
        case 'microsoft':
          // eslint-disable-next-line
          return 'data:image/png;base64,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';
      }
    };

    // Add the buttons
    this.buttons = providers
      // Only show Local Authentication button when login form is not present
      .filter((x) => !(this.hasLocalAuthForm && x.provider === 'localAuthentication'))
      .map((x) => {
        const handler = (): void => {
          this.onInput(x.provider);
        };
        const element = el<HTMLButtonElement>('button', 'btn btn-social mt-3');
        let htmlStr;

        if (x.uiConfig) {
          const { buttonImage, buttonDisplayName } = x.uiConfig;
          const { baseUrl } = serverConfig;
          let btnImageUrl;

          if (buttonImage) {
            btnImageUrl = buttonImage.startsWith('http')
              ? buttonImage
              : `${baseUrl}XUI/${buttonImage}`;
          } else {
            btnImageUrl = getFallbackImage(x.provider);
          }

          element.classList.add(`btn-social-${x.provider}`);
          htmlStr = `
              ${
                btnImageUrl
                  ? `<img height="20px" style="padding-right:5px;" src="${btnImageUrl}" />`
                  : ``
              }
              <span>${buttonDisplayName}</span>
            `;
        } else {
          element.classList.add('btn-outline-secondary');
          htmlStr = x.provider === 'localAuthentication' ? 'Sign-in with Email' : x.provider;
        }
        element.innerHTML = htmlStr;
        element.addEventListener('click', handler);
        return { element, handler };
      });
    styleEl.innerHTML = cssStr;
    formGroup.appendChild(styleEl);
    this.buttons.forEach((x) => formGroup.appendChild(x.element));

    if (this.hasLocalAuthForm) {
      const hr = el<HTMLButtonElement>('hr', 'fr-rule');
      formGroup.appendChild(hr);
    }

    return formGroup;
  };

  private onInput = (value: string): void => {
    this.wasChosen = true;
    this.callback.setProvider(value);
    this.onChange(this);
  };

  public onOtherInput = (value: string): void => {
    this.wasChosen = true;
    this.callback.setProvider(value);
  };
}

export default SelectIdPCallbackRenderer;
