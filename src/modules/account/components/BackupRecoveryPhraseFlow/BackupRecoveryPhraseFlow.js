import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from 'src/modules/common/components/MultiStep';
import EnterPasswordForm from '@auth/components/EnterPasswordForm';
import SavePassphrase from '@auth/components/SavePassphrase/SavePassphrase';
import styles from './BackupRecoveryPhraseFlow.css';

const BackupRecoveryPhraseFlow = () => {
  const { t } = useTranslation();
  const multiStepRef = useRef(null);
  const [passphrase, setPassphrase] = useState('');

  const onEnterPasswordSuccess = ({ recoveryPhrase }) => {
    setPassphrase(recoveryPhrase);
    multiStepRef.current.next();
  };

  return (
    <>
      <div className={`${styles.backupRecoveryPhraseFlow} ${grid.row}`}>
        <MultiStep navStyles={{ multiStepWrapper: styles.wrapper }} ref={multiStepRef}>
          <EnterPasswordForm onEnterPasswordSuccess={onEnterPasswordSuccess} />
          <SavePassphrase passphrase={passphrase} title={t('Backup account')} isJsonBackup />
        </MultiStep>
      </div>
    </>
  );
};

export default BackupRecoveryPhraseFlow;
