import React, { useRef } from 'react';
import { withRouter } from 'react-router';
import routes from 'src/routes/routes';
import EnterPasswordForm from '@auth/components/EnterPasswordForm';
import SetPasswordSuccess from '@auth/components/SetPasswordSuccess';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import EditAccountForm from './EditAccountForm';
import { useAccounts, useCurrentAccount } from '../../hooks';
import styles from './EditAccountForm.css';

const EditAccount = ({ history }) => {
  const [currentAccount, setCurrentAccount] = useCurrentAccount();
  const { setAccount } = useAccounts();
  const multiStepRef = useRef(null);

  const onEnterPasswordSuccess = ({ encryptedAccount }) => {
    setAccount(encryptedAccount);
    setCurrentAccount(encryptedAccount);
    multiStepRef.current.next();
  };

  return (
    <MultiStep key="edit-account-name" className={styles.container} ref={multiStepRef}>
      <EditAccountForm onBack={history.goBack} />
      <EnterPasswordForm onEnterPasswordSuccess={onEnterPasswordSuccess} />
      <SetPasswordSuccess
        encryptedPhrase={currentAccount}
        onClose={() => history.push(routes.dashboard.path)}
      />
    </MultiStep>
  );
};

export default withRouter(EditAccount);
