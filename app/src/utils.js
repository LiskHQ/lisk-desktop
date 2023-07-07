const PERMISSION_WHITE_LIST = ['clipboard-read', 'notifications', 'openExternal'];
const WHITE_LISTED_DEEP_LINKS = [
  {
    pathRegex: /^\/\/wallet\/?$/,
    allowedSearchParams: ['modal', 'recipient', 'amount', 'token', 'recipientChain', 'reference'],
  },
];

export const setRendererPermissions = (win) => {
  win.browser.webContents.session.setPermissionRequestHandler((_, permission, callback) => {
    callback(PERMISSION_WHITE_LIST.includes(permission));
  });
};

export const canExecuteDeepLinking = (url) => {
  const { protocol, href, searchParams } = new URL(url);
  if (protocol !== 'lisk:') return false;

  const pathname = href.match(/(?<=(lisk:))(\/\/[\w|/]+)/g)?.[0];
  const foundLink = WHITE_LISTED_DEEP_LINKS.find(({ pathRegex }) => pathRegex.test(pathname));
  if (!foundLink) return false;

  const urlSearchParams = [...searchParams.keys()];
  const isSearchParamsAllowed = urlSearchParams.reduce((result, search) => {
    if (!result) return false;
    return foundLink.allowedSearchParams.includes(search);
  }, true);

  if (!isSearchParamsAllowed) return false;

  return true;
};
