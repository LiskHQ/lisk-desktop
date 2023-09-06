/* eslint-disable max-statements */
import { validator } from '@liskhq/lisk-client';
import { requestTokenSchema } from './validationSchema';

const PERMISSION_WHITE_LIST = ['clipboard-read', 'notifications', 'openExternal'];
export const WHITE_LISTED_DEEP_LINKS = [
  {
    pathRegex: /^wallet$/,
    validationSchema: requestTokenSchema,
  },
];

const WHITE_LISTED_URLS = [
  { protocol: 'https:', urlKey: 'host', domains: ['lisk.com'] },
  { protocol: 'mailto:', urlKey: 'pathname', domains: ['desktopdev@lisk.com'] },
];

export const isUrlAllowed = (url) => {
  const urlData = new URL(url);

  WHITE_LISTED_URLS.some(
    ({ protocol, urlKey, domains }) =>
      protocol === urlData.protocol && domains.includes(urlData[urlKey])
  );
};

export const setRendererPermissions = (win) => {
  win.browser.webContents.session.setPermissionRequestHandler((_, permission, callback) => {
    callback(PERMISSION_WHITE_LIST.includes(permission));
  });
};

export const canExecuteDeepLinking = (url) => {
  const { protocol, searchParams, hostname, pathname } = new URL(url);

  if (protocol !== 'lisk:') return false;

  let urlPath = hostname;
  if (hostname.length === 0) urlPath = pathname.replace(/^\/{2}/, '');

  const foundLink = WHITE_LISTED_DEEP_LINKS.find(({ pathRegex }) => pathRegex.test(urlPath));

  if (!foundLink) return false;

  const searchParamObject = [...searchParams.entries()].reduce(
    (result, [key, value]) => ({ ...result, [key]: value }),
    {}
  );

  const isSearchParamsValid = Object.keys(searchParamObject).reduce((result, key) => {
    const schemaValue = !!foundLink.validationSchema.properties[key];
    if (!schemaValue || !result) return false;
    return true;
  }, true);

  if (!isSearchParamsValid) return false;

  try {
    validator.validator.validate(foundLink.validationSchema, searchParamObject);
  } catch {
    return false;
  }

  return true;
};
