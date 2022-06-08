/* eslint-disable max-lines */
import React from 'react';
import { withRouter } from 'react-router';
import routes from '@screens/router/routes';
import RestoreAccountForm from 'src/modules/auth/components/RestoreAccountForm';
import EnterPasswordForm from 'src/modules/auth/components/EnterPasswordForm';
import SetPasswordSuccess from '@auth/components/SetPasswordSuccess';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import styles from './AddAccountByFile.css';
import { useCurrentAccount } from '../../hooks';

const AddAccountByPassFile = ({ history, login }) => {
  const [, setCurrentAccount] = useCurrentAccount();

  const onEnterPasswordSuccess = ({ account, recoveryPhrase }) => {
    setCurrentAccount(account);
    login(recoveryPhrase); // Todo: this login method is depricated
  };

  return (
    <MultiStep
      key="add-account-file"
      className={styles.container}
    >
      <RestoreAccountForm onBack={history.goBack} />
      <EnterPasswordForm onEnterPasswordSuccess={onEnterPasswordSuccess} />
      <SetPasswordSuccess onClose={() => history.push(routes.dashboard.path)} />
    </MultiStep>
  );
};

export default withRouter(AddAccountByPassFile);
