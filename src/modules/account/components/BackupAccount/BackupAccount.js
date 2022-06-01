import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from 'src/modules/common/components/MultiStep';
import EnterPasswordForm from '@auth/components/EnterPasswordForm';
import PassphraseBackup from '@auth/components/passphraseBackup';
import ConfirmPassphrase from '@auth/components/ConfirmPassphrase/confirmPassphrase';
import SetPasswordSuccess from '@auth/components/setPasswordSuccess';
import styles from './BackupAccount.css';

const BackupAccount = () => {
  const multiStepRef = useRef(null);

  return (
    <>
      <div className={`${styles.backupAccount} ${grid.row}`}>
        <MultiStep
          navStyles={{ multiStepWrapper: styles.wrapper }}
          ref={multiStepRef}
        >
          <EnterPasswordForm />
          <PassphraseBackup />
          <ConfirmPassphrase />
          <SetPasswordSuccess />
        </MultiStep>
      </div>
    </>
  );
};

export default withRouter(BackupAccount);
