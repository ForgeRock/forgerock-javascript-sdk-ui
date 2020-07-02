import { Response, Server } from 'miragejs';
import { AM_HOSTNAME, AM_PATH, AM_PORT, makeBaseUrl } from '../constants';
import data from './data';

new Server({
  routes() {
    this.urlPrefix = makeBaseUrl(AM_HOSTNAME, AM_PORT);
    this.namespace = AM_PATH;

    this.post('/json/realms/root/authenticate', (schema, request) => {
      return data[request.queryParams.authIndexValue];
    });

    this.post('/oauth2/realms/root/access_token', (schema, request) => {
      return new Response(200, {}, accessToken);
    });

    this.get('/oauth2/realms/root/userinfo', (schema, request) => {
      return userInfo;
    });

    this.get('/oauth2/realms/root/connect/endSession', (schema, request) => {
      return new Response(204);
    });

    this.post('/oauth2/realms/root/token/revoke', (schema, request) => {
      return new Response(200);
    });
  },
});
