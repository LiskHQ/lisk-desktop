/* eslint-disable max-lines */
import React from 'react';
import { withRouter } from 'react-router';
import RestoreAccountForm from 'src/modules/auth/components/restoreAccountForm';
import styles from './AddAccountByFile.css';

const AddAccountByPassFile = ({ history }) => {
  const onSubmit = () => {
  };

  return (
    <div className={styles.container}>
      <RestoreAccountForm onSubmit={onSubmit} onBack={history.goBack} />
    </div>
  );
};

export default withRouter(AddAccountByPassFile);
