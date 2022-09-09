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

const AddAccountByPassFile = ({ history, login }) => {
  const [currentAccount, setCurrentAccount] = useCurrentAccount();
  const { setAccount } = useAccounts();
  const multiStepRef = useRef(null);

  const onEnterPasswordSuccess = ({ recoveryPhrase, encryptedAccount }) => {
    setAccount(encryptedAccount);
    setCurrentAccount(encryptedAccount);
    multiStepRef.current.next();
    login(recoveryPhrase); // Todo: this login method is depricated
  };

  return (
    <MultiStep key="add-account-file" className={styles.container} ref={multiStepRef}>
      <RestoreAccountForm onBack={history.goBack} />
      <EnterPasswordForm onEnterPasswordSuccess={onEnterPasswordSuccess} />
      <SetPasswordSuccess
        encryptedPhrase={currentAccount}
        onClose={() => history.push(routes.dashboard.path)}
      />
    </MultiStep>
  );
};

export default withRouter(AddAccountByPassFile);
