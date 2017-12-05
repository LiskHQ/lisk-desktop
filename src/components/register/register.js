import React from 'react';
import { translate } from 'react-i18next';
import MultiStep from '../multiStep';
import PassphraseInfo from '../passphrase/passphraseInfo';
import PassphraseGenerator from '../passphrase/passphraseGenerator';
import PassphraseVerifier from '../passphrase/passphraseVerifier';
import PassphraseShow from '../passphrase/passphraseShow';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';
import { validateUrl, getLoginData } from '../../utils/login';

const Register = ({
  activePeerSet, t,
}) => {
  const onRegister = (passphrase) => {
    const { networkIndex, address } = getLoginData();

    let index = networkIndex;
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

  const useCaseNote = t('your passphrase will be required for logging in to your account.');
  const securityNote = t('This passphrase is not recoverable and if you lose it, you will lose access to your account forever.');

  return (<MultiStep finalCallback={onRegister}>
    <PassphraseInfo title='Info' t={t} icon='bookmark_border'
      useCaseNote={useCaseNote} securityNote={securityNote} backButtonFn={() => {}} />
    <PassphraseGenerator title='Create' t={t} icon='vpn_key' />
    <PassphraseShow title='Safekeeping' t={t} icon='done' />
    <PassphraseVerifier title='Confirm' t={t} confirmButton='Login' icon='launch' />
  </MultiStep>);
};

export default translate()(Register);

