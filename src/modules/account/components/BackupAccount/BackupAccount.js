import React, { useRef, useState } from 'react';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from 'src/modules/common/components/MultiStep';
import EnterPasswordForm from '@auth/components/EnterPasswordForm';
import SavePassphrase from '@auth/components/SavePassphrase/SavePassphrase';
import ConfirmPassphrase from '@auth/components/ConfirmPassphrase/confirmPassphrase';
import SetPasswordSuccess from '@auth/components/setPasswordSuccess';
import { useCurrentAccount } from '@account/hooks/useCurrentAccount';
import styles from './BackupAccount.css';

const BackupAccount = ({ history }) => {
  const multiStepRef = useRef(null);
  const [account] = useCurrentAccount();
  const [passphrase, setPassphrase] = useState('');

  const onEnterPasswordSuccess = ({ recoveryPhrase }) => {
    setPassphrase(recoveryPhrase);
    multiStepRef.current.next();
  };

  const onComplete = () => {
    history.push('/wallet');
  };

  return (
    <>
      <div className={`${styles.backupAccount} ${grid.row}`}>
        <MultiStep
          navStyles={{ multiStepWrapper: styles.wrapper }}
          ref={multiStepRef}
        >
          <EnterPasswordForm
            accountSchema={account}
            onEnterPasswordSuccess={onEnterPasswordSuccess}
          />
          <SavePassphrase passphrase={passphrase} />
          <ConfirmPassphrase passphrase={passphrase} />
          <SetPasswordSuccess buttonText="Continue to Wallet" encryptedPhrase={account} onClose={onComplete} />
        </MultiStep>
      </div>
    </>
  );
};

export default withRouter(BackupAccount);
