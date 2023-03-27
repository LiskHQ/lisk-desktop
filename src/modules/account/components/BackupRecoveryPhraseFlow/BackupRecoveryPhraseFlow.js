import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import routes from 'src/routes/routes';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from 'src/modules/common/components/MultiStep';
import EnterPasswordForm from '@auth/components/EnterPasswordForm';
import SavePassphrase from '@auth/components/SavePassphrase/SavePassphrase';
import ConfirmPassphrase from '@auth/components/ConfirmPassphrase/confirmPassphrase';
import SetPasswordSuccess from '@auth/components/SetPasswordSuccess';
import { useCurrentAccount } from '@account/hooks/useCurrentAccount';
import styles from './BackupRecoveryPhraseFlow.css';

const BackupRecoveryPhraseFlow = ({ history }) => {
  const { t } = useTranslation();
  const multiStepRef = useRef(null);
  const [account] = useCurrentAccount();
  const [passphrase, setPassphrase] = useState('');

  const onEnterPasswordSuccess = ({ recoveryPhrase }) => {
    setPassphrase(recoveryPhrase);
    multiStepRef.current.next();
  };

  const onComplete = () => {
    history.push(routes.wallet.path);
  };

  return (
    <>
      <div className={`${styles.backupRecoveryPhraseFlow} ${grid.row}`}>
        <MultiStep navStyles={{ multiStepWrapper: styles.wrapper }} ref={multiStepRef}>
          <EnterPasswordForm onEnterPasswordSuccess={onEnterPasswordSuccess} />
          <SavePassphrase passphrase={passphrase} title={t('Backup your secret recovery phrase')} />
          <ConfirmPassphrase passphrase={passphrase} />
          <SetPasswordSuccess
            buttonText={t('Continue to wallet')}
            encryptedPhrase={account}
            onClose={onComplete}
          />
        </MultiStep>
      </div>
    </>
  );
};

export default withRouter(BackupRecoveryPhraseFlow);
