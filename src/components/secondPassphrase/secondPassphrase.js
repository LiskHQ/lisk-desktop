import React from 'react';
import Fees from '../../constants/fees';
import Authenticate from '../authenticate';
import MultiStep from '../multiStep';
import Info from '../passphrase/info';
import Create from '../passphrase/create';
import Safekeeping from '../passphrase/safekeeping';
import Confirm from '../passphrase/confirm';

const SecondPassphrase = ({
  passphrase, account, peers, registerSecondPassphrase, closeDialog, t,
}) => {
  const onPassphraseRegister = (secondPassphrase) => {
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
      <MultiStep showNav={false} finalCallback={onPassphraseRegister}>
        <Info title='Info' t={t} icon='bookmark_border' fee={Fees.setSecondPassphrase}
          useCaseNote={useCaseNote} securityNote={securityNote} backButtonFn={closeDialog} />
        <Create title='Create' t={t} icon='vpn_key' />
        <Safekeeping title='Safekeeping' t={t} icon='done' />
        <Confirm title='Confirm' t={t} confirmButton='Register' icon='launch' />
      </MultiStep> :
      <Authenticate nextAction={t('set second passphrase')} />);
};

export default SecondPassphrase;
