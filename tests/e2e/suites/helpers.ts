/*
 * @forgerock/javascript-sdk-ui
 *
 * helpers.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { ElementHandle } from 'puppeteer';
import { AM_URL, APP_URL, CLIENT_ID, REALM_PATH, REDIRECT_URI, SCOPE } from '../constants';

async function setTree(tree: string): Promise<void> {
  const url = new URL(APP_URL);
  url.searchParams.set('amUrl', AM_URL);
  url.searchParams.set('clientId', CLIENT_ID);
  url.searchParams.set('redirectUri', REDIRECT_URI);
  url.searchParams.set('realmPath', REALM_PATH);
  url.searchParams.set('scope', SCOPE);
  url.searchParams.set('tree', tree);
  page.goto(url.toString());
}

async function getElement<T extends HTMLElement>(
  selector: string | ElementHandle,
): Promise<ElementHandle<T>> {
  const element = typeof selector === 'string' ? await page.waitForSelector(selector) : selector;
  return element;
}

async function getElements<T extends HTMLElement>(selector: string): Promise<ElementHandle<T>[]> {
  await page.waitForSelector(selector);
  const elements = await page.$$(selector);
  return elements;
}

async function getProperty<T>(selector: string | ElementHandle, property: string): Promise<T> {
  const element = await getElement(selector);
  const propertyHandle = await element.getProperty(property);
  const propertyValue = await propertyHandle.jsonValue();
  return propertyValue as T;
}

async function getClassName(selector: string | ElementHandle): Promise<string> {
  const value = await getProperty<string>(selector, 'className');
  return value;
}

async function getInnerHtml(selector: string | ElementHandle): Promise<string> {
  const innerHtml = await getProperty<string>(selector, 'innerHTML');
  return innerHtml;
}

async function getValue(selector: string | ElementHandle): Promise<string> {
  const value = await getProperty<string>(selector, 'value');
  return value;
}

async function hasClass(selector: string | ElementHandle, className: string): Promise<boolean> {
  const classNames = await getClassName(selector);
  return classNames.indexOf(className) > -1;
}

async function setDropdownValue(selector: string | ElementHandle, value: string): Promise<void> {
  const element = await getElement(selector);
  await element.select(value);
}

async function isSubmitEnabled(): Promise<boolean> {
  const button = await page.waitForSelector('#fr-submit');
  const propertyHandle = await button.getProperty('disabled');
  const propertyValue = await propertyHandle.jsonValue();
  if (typeof propertyValue !== 'boolean') {
    throw new Error('Submit button disabled property is not a boolean');
  }
  return !propertyValue;
}

export {
  getClassName,
  getElement,
  getElements,
  getInnerHtml,
  getProperty,
  getValue,
  hasClass,
  isSubmitEnabled,
  setDropdownValue,
  setTree,
};
