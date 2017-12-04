import React from 'react';
import Fees from '../../constants/fees';
import Authenticate from '../authenticate';
import MultiStep from '../multiStep';
import PassphraseInfo from '../passphrase/passphraseInfo';
import PassphraseGenerator from '../passphrase/passphraseGenerator';
import PassphraseVerifier from '../passphrase/passphraseVerifier';
import PassphraseShow from '../passphrase/passphraseShow';

const SecondPassphrase = ({
  passphrase, account, peers, registerSecondPassphrase, closeDialog, t,
}) => {
  const onLoginSubmission = (secondPassphrase) => {
    registerSecondPassphrase({
      activePeer: peers.data,
      secondPassphrase,
      account,
    });
  };

  const useCaseNote = t('your second passphrase will be required for all transactions sent from this account');
  const securityNote = t('Losing access to this passphrase will mean no funds can be sent from this account.');

  return (
    typeof passphrase === 'string' && passphrase.length > 0 ?
      <MultiStep showNav={false}>
        <PassphraseInfo title='Info' t={t} icon='bookmark_border' fee={Fees.setSecondPassphrase}
          useCaseNote={useCaseNote} securityNote={securityNote} backButtonFn={closeDialog} />
        <PassphraseGenerator title='Create' t={t} icon='vpn_key' />
        <PassphraseShow title='Safekeeping' t={t} icon='done' />
        <PassphraseVerifier title='Confirm' t={t} confirmButton='Register'
          onPassGenerated={onLoginSubmission} icon='launch' />
      </MultiStep> :
      <Authenticate nextAction={t('set second passphrase')} />);
};

export default SecondPassphrase;
