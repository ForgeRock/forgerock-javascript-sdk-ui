const AM_HOSTNAME = 'https://default.iam.example.com';
const AM_PATH = '/am';
const AM_PORT = '';

const APP_HOSTNAME = 'https://sdkapp.example.com';
const APP_PORT = '8443';

const CLIENT_ID = 'foo';
const REALM_PATH = 'root';
const REDIRECT_URI = makeBaseUrl(APP_HOSTNAME, APP_PORT) + '/callback';
const SCOPE = 'openid profile';

function makeBaseUrl(host, port) {
  return port ? `${host}:${port}` : host;
}

module.exports = {
  AM_HOSTNAME,
  AM_PATH,
  AM_PORT,
  AM_URL: makeBaseUrl(AM_HOSTNAME, AM_PORT) + AM_PATH,
  APP_HOSTNAME,
  APP_PORT,
  APP_URL: makeBaseUrl(APP_HOSTNAME, APP_PORT),
  CLIENT_ID,
  REALM_PATH,
  REDIRECT_URI,
  SCOPE,
  makeBaseUrl,
};
