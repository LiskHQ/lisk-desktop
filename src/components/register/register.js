import React from 'react';
import Passphrase from '../passphrase';
import networksRaw from '../login/networks';

const Register = ({
  activePeerSet, closeDialog, t,
}) => {
  const validateUrl = (value) => {
    const addHttp = (url) => {
      const reg = /^(?:f|ht)tps?:\/\//i;
      return reg.test(url) ? url : `http://${url}`;
    };

    const errorMessage = 'URL is invalid';

    const isValidLocalhost = url => url.hostname === 'localhost' && url.port.length > 1;
    const isValidRemote = url => /(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})/.test(url.hostname);

    let addressValidity = '';
    try {
      const url = new URL(addHttp(value));
      addressValidity = url && (isValidRemote(url) || isValidLocalhost(url)) ? '' : errorMessage;
    } catch (e) {
      addressValidity = errorMessage;
    }

    return addressValidity === '';
  };

  const onLoginSubmission = (passphrase) => {
    let NetworkIndex = parseInt(localStorage.getItem('network'), 10) || 0;
    const address = localStorage.getItem('address') || '';
    if (!NetworkIndex || (NetworkIndex === 2 && !validateUrl(address))) {
      NetworkIndex = 0;
    }

    const network = Object.assign({}, networksRaw[NetworkIndex]);
    if (NetworkIndex === 2) {
      network.address = address;
    }

    // set active peer
    activePeerSet({
      passphrase,
      network,
    });
  };

  return (
    <Passphrase
      onPassGenerated={onLoginSubmission}
      keepModal={false}
      closeDialog={closeDialog}
      confirmButton={'Login'}
      useCaseNote={t('your passphrase will be required for logging in to your account.')}
      securityNote={t('This passphrase is not recoverable and if you lose it, you will lose access to your account forever.')}/>
  );
};

export default Register;
