/* eslint-disable max-lines */
import React from 'react';
import { withRouter } from 'react-router';
import routes from '@screens/router/routes';
import { useAccounts } from '@account/hooks/useAccounts';
import RestoreAccountForm from 'src/modules/auth/components/RestoreAccountForm';
import EnterPasswordForm from 'src/modules/auth/components/EnterPasswordForm';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import styles from './AddAccountByFile.css';

const AddAccountByPassFile = ({ history }) => {
  const [account, setAccount] = useAccounts();

  const onEnterPasswordSuccess = () => {
    history.push(routes.dashboard.path);
  };

  return (
    <MultiStep
      key="add-account-file"
      className={styles.container}
    >
      <RestoreAccountForm onSubmit={setAccount} onBack={history.goBack} />
      <EnterPasswordForm accountSchema={account} onEnterPasswordSuccess={onEnterPasswordSuccess} />
    </MultiStep>
  );
};

export default withRouter(AddAccountByPassFile);
