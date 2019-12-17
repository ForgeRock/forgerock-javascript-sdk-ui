import { AM_URL, APP_URL, CLIENT_ID, REALM_PATH, REDIRECT_URI, SCOPE } from '../constants';

async function setTree(tree: string) {
  const url = new URL(APP_URL);
  url.searchParams.set('amUrl', AM_URL);
  url.searchParams.set('clientId', CLIENT_ID);
  url.searchParams.set('redirectUri', REDIRECT_URI);
  url.searchParams.set('realmPath', REALM_PATH);
  url.searchParams.set('scope', SCOPE);
  url.searchParams.set('tree', tree);
  await page.goto(url.toString());
}

async function getAttribute(selector: string, property: string): Promise<unknown> {
  const element = await page.waitForSelector(selector);
  const propertyHandle = await element.getProperty(property);
  const propertyValue = await propertyHandle.jsonValue();
  return propertyValue;
}

async function getInnerHtml(selector: string): Promise<unknown> {
  const innerHtml = await getAttribute(selector, 'innerHTML');
  return innerHtml;
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

export { getAttribute, getInnerHtml, isSubmitEnabled, setTree };
