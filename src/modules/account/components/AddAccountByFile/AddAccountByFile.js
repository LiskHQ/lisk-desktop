import React, { useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from 'src/routes/routes';
import RestoreAccountForm from 'src/modules/auth/components/RestoreAccountForm';
import EnterPasswordForm from 'src/modules/auth/components/EnterPasswordForm';
import SetPasswordSuccess from '@auth/components/SetPasswordSuccess';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import styles from './AddAccountByFile.css';
import { useAccounts, useCurrentAccount } from '../../hooks';

const AddAccountByPassFile = () => {
  const history = useHistory();
  const { search } = useLocation();
  const [currentAccount, setCurrentAccount] = useCurrentAccount();
  const { setAccount } = useAccounts();
  const multiStepRef = useRef(null);
  const queryParams = new URLSearchParams(search);
  const referrer = queryParams.get('referrer');
  const { t } = useTranslation();

  const onEnterPasswordSuccess = ({ encryptedAccount }) => {
    setAccount(encryptedAccount);
    setCurrentAccount(encryptedAccount, null, false);
    multiStepRef.current?.next();
  };

  return (
    <MultiStep key="add-account-file" className={styles.container} ref={multiStepRef}>
      <RestoreAccountForm onBack={history.goBack} />
      <EnterPasswordForm
        showBackButton
        prevStep={multiStepRef.current?.prev}
        className={styles.enterPasswordContainer}
        onEnterPasswordSuccess={onEnterPasswordSuccess}
        title={t('Please enter your account password to restore this account.')}
      />
      <SetPasswordSuccess
        encryptedPhrase={currentAccount}
        onClose={() => history.push(referrer || routes.wallet.path)}
      />
    </MultiStep>
  );
};

export default AddAccountByPassFile;
