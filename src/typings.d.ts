/*
 * @forgerock/javascript-sdk-ui
 *
 * typings.d.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

declare module '*.html' {
  const content: string;
  export = content;
}

interface Window {
  grecaptcha: {
    render: (
      container: string | HTMLElement,
      params: {
        callback: (result: string) => void;
        'expired-callback': () => void;
        sitekey: string;
      },
    ) => void;
  };
}
