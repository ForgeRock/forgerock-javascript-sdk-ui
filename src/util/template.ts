/*
 * @forgerock/javascript-sdk-ui
 *
 * template.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

const replaceTokens = (s: string, tokens: { [key: string]: string }): string => {
  for (const k in tokens) {
    if (tokens.hasOwnProperty(k)) {
      s = s.replace(new RegExp(`{${k}}`, 'g'), tokens[k]);
    }
  }
  return s;
};

export { replaceTokens };
