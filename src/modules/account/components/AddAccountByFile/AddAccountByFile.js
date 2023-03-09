/* eslint-disable max-lines */
import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import routes from 'src/routes/routes';
import RestoreAccountForm from 'src/modules/auth/components/RestoreAccountForm';
import EnterPasswordForm from 'src/modules/auth/components/EnterPasswordForm';
import SetPasswordSuccess from '@auth/components/SetPasswordSuccess';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import styles from './AddAccountByFile.css';
import { useAccounts, useCurrentAccount } from '../../hooks';

const AddAccountByPassFile = ({ history, location: { search } }) => {
  const [currentAccount, setCurrentAccount] = useCurrentAccount();
  const { setAccount } = useAccounts();
  const multiStepRef = useRef(null);
  const queryParams = new URLSearchParams(search);
  const referrer = queryParams.get('referrer');

  const onEnterPasswordSuccess = ({ encryptedAccount }) => {
    setAccount(encryptedAccount);
    setCurrentAccount(encryptedAccount);
    multiStepRef.current.next();
  };

  return (
    <MultiStep key="add-account-file" className={styles.container} ref={multiStepRef}>
      <RestoreAccountForm onBack={history.goBack} />
      <EnterPasswordForm onEnterPasswordSuccess={onEnterPasswordSuccess} />
      <SetPasswordSuccess
        encryptedPhrase={currentAccount}
        onClose={() => history.push(referrer || routes.dashboard.path)}
      />
    </MultiStep>
  );
};

export default withRouter(AddAccountByPassFile);
