import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { selectActiveTokenAccount } from '@common/store';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from 'src/modules/common/components/MultiStep';
import EnterPasswordForm from '@auth/components/EnterPasswordForm';
import SavePassphrase from '@auth/components/SavePassphrase/SavePassphrase';
import ConfirmPassphrase from '@auth/components/ConfirmPassphrase/confirmPassphrase';
import SetPasswordSuccess from '@auth/components/setPasswordSuccess';
import useEncryptAccount from '@account/hooks/useEncryptAccount';
import styles from './BackupAccount.css';

const BackupAccount = () => {
  const multiStepRef = useRef(null);
  const account = useSelector(selectActiveTokenAccount);
  const backupJSON = useEncryptAccount(account.passphrase, 'password');

  const onEnterPasswordSuccess = () => {
    multiStepRef.current.next();
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
          <SavePassphrase account={account} />
          <ConfirmPassphrase account={account} passphrase={account.passphrase} />
          <SetPasswordSuccess buttonText="Continue to Wallet" encryptedPhrase={backupJSON} />
        </MultiStep>
      </div>
    </>
  );
};

export default withRouter(BackupAccount);
