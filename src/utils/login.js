import i18next from 'i18next';
import settingConstants from 'src/modules/settings/const/settingConstants';

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const pattern = new RegExp(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/gi);

const isValidUrlRegEx = urlStr => pattern.test(urlStr);

const isValidLocalhost = url => url.hostname === 'localhost' && url.port.length > 1;
const isValidRemote = url => /(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3})/.test(url.hostname);

const isValidIp = url => (isValidLocalhost(url)
  || isValidRemote(url)
  || isValidUrlRegEx(url.toString()));

export const addHttp = (url) => {
  const domainReg = /^(?:f|ht)tps?:\/\//i;
  const ipReg = /^(\d+\.\d+\.\d+\.\d+)(:\d+)?/;
  if (ipReg.test(url)) {
    return `http://${url}`;
  }
  if (!domainReg.test(url)) {
    return `https://${url}`;
  }
  return url;
};
// eslint-disable-next-line import/prefer-default-export
export const validateUrl = (value) => {
  let url;
  let addressValidity = '';
  const errorMessage = i18next.t('Please check the address');
  try {
    url = new URL(addHttp(value));
    addressValidity = value.indexOf(' ') === -1 && isValidIp(url) ? '' : errorMessage;
  } catch (e) {
    addressValidity = errorMessage;
  }

  return { address: value, addressValidity };
};

// Ignore coverage because this is only development feature
export const getAutoLogInData = /* istanbul ignore next */ () => ({
  [settingConstants.keys.loginKey]: localStorage.getItem(settingConstants.keys.loginKey),
});

// Ignore coverage because this is only development feature
export const shouldAutoLogIn = false;
// export const shouldAutoLogIn = /* istanbul ignore next */ autoLogin =>
//  !!autoLogin[settingConstants.keys.loginKey] && autoLogin[settingConstants.keys.loginKey] !== '';
