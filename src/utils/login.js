import i18next from 'i18next';

const protocolRegEx = /^(https?:\/\/)?/;

// eslint-disable-next-line import/prefer-default-export
export const validateUrl = (value) => {
  const addHttp = (url) => {
    const reg = /^(?:f|ht)tps?:\/\//i;
    return reg.test(url) ? url : `http://${url}`;
  };

  const errorMessage = i18next.t('URL is invalid');

  // TODO: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url#14582229

  const isValidLocalhost = url => url.hostname === 'localhost' && url.port.length > 1;
  const isValidRemote = url => /(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3})/.test(url.hostname);

  const isValidRemote = (urlStr) => {


    const urlPattern = new RegExp(+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment loca
  } 

  const isValidIp = url => isValidRemote(url) &&
    ((url.protocol === 'https:' && url.port === '') ||
      (url.protocol === 'http:' && url.port) ||
      (!url.protocol && url.port));

  let addressValidity = '';
  try {
    const url = new URL(addHttp(value));
    addressValidity = url && (isValidLocalhost(url) || isValidIp(url)) ? '' : errorMessage;
  } catch (e) {
    addressValidity = errorMessage;
  }

  return { address: value, addressValidity };
};
