/* eslint-disable max-lines */
import React from 'react';
import { withRouter } from 'react-router';
import routes from '@screens/router/routes';
import RestoreAccountForm from 'src/modules/auth/components/RestoreAccountForm';
import EnterPasswordForm from 'src/modules/auth/components/EnterPasswordForm';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import styles from './AddAccountByFile.css';
import { useCurrentAccount } from '../../hooks';

const AddAccountByPassFile = ({ history, login }) => {
  const [, setCurrentAccount] = useCurrentAccount();

  const onEnterPasswordSuccess = ({ accountSchema, recoveryPhrase }) => {
    setCurrentAccount(accountSchema);
    login(recoveryPhrase); // Todo: this login method is depricated
    history.push(routes.dashboard.path);
  };

  return (
    <MultiStep
      key="add-account-file"
      className={styles.container}
    >
      <RestoreAccountForm onBack={history.goBack} />
      <EnterPasswordForm onEnterPasswordSuccess={onEnterPasswordSuccess} />
    </MultiStep>
  );
};

export default withRouter(AddAccountByPassFile);
