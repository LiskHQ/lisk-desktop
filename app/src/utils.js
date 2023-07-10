/* eslint-disable max-statements */
import { validator } from '@liskhq/lisk-client';
import { requestTokenSchema } from './validationSchema';

const PERMISSION_WHITE_LIST = ['clipboard-read', 'notifications', 'openExternal'];
const WHITE_LISTED_DEEP_LINKS = [
  {
    pathRegex: /^\/\/wallet\/?$/,
    validationSchema: requestTokenSchema,
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

  const searchParamObject = [...searchParams.entries()].reduce(
    (result, [key, value]) => ({ ...result, [key]: value }),
    {}
  );

  let isSearchParamsAllowed;
    console.log('>>>', searchParamObject)
  try {
    isSearchParamsAllowed = validator.validator.validate(
      foundLink.validationSchema,
      searchParamObject
    );
  } catch (exp) {
    return false;
  }
  console.log('--- here ooo', isSearchParamsAllowed)
  if (!isSearchParamsAllowed) return false;

  return true;
};
