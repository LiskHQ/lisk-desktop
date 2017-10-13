import i18next from 'i18next';

const validateUrl = (value) => {
  const addHttp = (url) => {
    const reg = /^(?:f|ht)tps?:\/\//i;
    return reg.test(url) ? url : `http://${url}`;
  };

  const errorMessage = i18next.t('URL is invalid');

  const isValidLocalhost = url => url.hostname === 'localhost' && url.port.length > 1;
  const isValidRemote = url => /(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})/.test(url.hostname);

  let addressValidity = '';
  try {
    const url = new URL(addHttp(value));
    addressValidity = url && (isValidRemote(url) || isValidLocalhost(url)) ? '' : errorMessage;
  } catch (e) {
    addressValidity = errorMessage;
  }

  return { address: value, addressValidity };
};

const getLoginData = () => {
  const address = localStorage.getItem('address') || '';
  const passphrase = localStorage.getItem('passphrase') || '';
  const networkIndex = parseInt(localStorage.getItem('network'), 10) || 0;

  return { address, networkIndex, passphrase };
};

export { validateUrl, getLoginData };
