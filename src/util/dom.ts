/*
 * @forgerock/javascript-sdk-ui
 *
 * dom.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

function el<T extends HTMLElement>(tagName: string, className?: string): T {
  const d = document.createElement(tagName);
  if (className) {
    d.className = className;
  }
  return d as T;
}

export { el };
