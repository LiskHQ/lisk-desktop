import React from 'react';
import Passphrase from '../passphrase';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';
import { validateUrl, getLoginData } from '../../utils/login';

const Register = ({
  activePeerSet, closeDialog, t,
}) => {
  const onLoginSubmission = (passphrase) => {
    const { networkIndex, address } = getLoginData();

    let index = networkIndex;

    // if (!index || (index === networksCode.customNode && 
    // validateUrl(address).addressValidity !== '')) {
    if (!index || (index === networks.customNode.code && validateUrl(address).addressValidity !== '')) {
      index = networks.mainnet.code;
    }

    const network = Object.assign({}, getNetwork(index));
    if (index === networks.customNode.code) { network.address = address; }

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
