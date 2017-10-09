import React from 'react';
import Passphrase from '../passphrase';
import getNetworks from '../login/networks';
import { validateUrl, getLoginData } from '../../utils/login';

const Register = ({
  activePeerSet, closeDialog, t,
}) => {
  const onLoginSubmission = (passphrase) => {
    const { networkIndex, address } = getLoginData();

    let index = networkIndex;

    if (!index || (index === 2 && !validateUrl(address).addressValidity === '')) {
      index = 0;
    }

    const network = Object.assign({}, getNetworks()[index]);
    if (index === 2) { network.address = address; }

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
