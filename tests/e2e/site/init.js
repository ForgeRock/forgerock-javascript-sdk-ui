async function login() {
  const url = new URL(window.location.href);
  const baseUrl = url.searchParams.get('amUrl');
  const clientId = url.searchParams.get('clientId');
  const redirectUri = url.searchParams.get('redirectUri');
  const realmPath = url.searchParams.get('realmPath');
  const scope = url.searchParams.get('scope');
  const tree = url.searchParams.get('tree');

  forgerock.Config.set({
    clientId,
    redirectUri,
    scope,
    serverConfig: { baseUrl, timeout: 30000 },
    realmPath,
    tree,
  });

  const frui = new forgerock.FRUI();
  await frui.getSession();
}

window.addEventListener('load', login);
