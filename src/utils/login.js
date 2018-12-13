import i18next from 'i18next';
import settings from '../constants/settings';
import networks from '../constants/networks';

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
// eslint-disable-next-line no-useless-escape
const pattern = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);

const isValidUrlRegEx = urlStr => pattern.test(urlStr);

const isValidLocalhost = url => url.hostname === 'localhost' && url.port.length > 1;
const isValidRemote = url => /(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3})/.test(url.hostname);

const isValidIp = url => (isValidLocalhost(url)
|| isValidRemote(url)
|| isValidUrlRegEx(url.toString()));

export const addHttp = (url) => {
  const reg = /^(?:f|ht)tps?:\/\//i;
  return reg.test(url) ? url : `http://${url}`;
};
// eslint-disable-next-line import/prefer-default-export
export const validateUrl = (value) => {
  let url;
  let addressValidity = '';
  const errorMessage = i18next.t('URL is invalid');
  try {
    url = new URL(addHttp(value));
    addressValidity = url && value.indexOf(' ') === -1 && isValidIp(url) ? '' : errorMessage;
  } catch (e) {
    addressValidity = errorMessage;
  }

  return { address: value, addressValidity };
};


export const getAutoLogInData = () => ({
  [settings.keys.loginKey]: localStorage.getItem(settings.keys.loginKey),
  [settings.keys.liskCoreUrl]: localStorage.getItem(settings.keys.liskCoreUrl),
});

export const shouldAutoLogIn = autologin => autologin[settings.keys.liskCoreUrl] && autologin[settings.keys.liskCoreUrl] !== ''
    && autologin[settings.keys.loginKey] && autologin[settings.keys.loginKey] !== '';

export const findMatchingLoginNetwork = () => {
  const { liskCoreUrl } = getAutoLogInData();
  return Object.entries(networks).find((network) => {
    const { nodes } = network.slice(-1).shift();
    return Array.isArray(nodes) ? nodes.includes(liskCoreUrl) : false;
  });
};
