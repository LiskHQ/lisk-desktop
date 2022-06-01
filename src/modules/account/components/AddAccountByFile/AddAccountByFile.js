/* eslint-disable max-lines */
import React from 'react';
import { withRouter } from 'react-router';
import { useAccounts } from '@account/hooks/useAccounts';
import RestoreAccountForm from 'src/modules/auth/components/RestoreAccountForm';
import EnterPasswordForm from 'src/modules/auth/components/EnterPasswordForm';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import styles from './AddAccountByFile.css';

const AddAccountByPassFile = ({ history }) => {
  const [accounts, setAccount] = useAccounts();
  const onSubmit = (account) => {
    setAccount(account);
  };

  return (
    <MultiStep
      key="add-account-file"
      className={styles.container}
    >
      <RestoreAccountForm onSubmit={onSubmit} onBack={history.goBack} />
    </MultiStep>
  );
};

export default withRouter(AddAccountByPassFile);
