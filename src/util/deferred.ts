/*
 * @forgerock/javascript-sdk-ui
 *
 * deferred.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

class Deferred<T> {
  public promise: Promise<T>;
  public resolve!: (value: T) => void;
  public reject!: (reason: unknown) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

export default Deferred;
