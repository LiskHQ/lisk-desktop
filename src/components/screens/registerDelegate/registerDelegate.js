import React from 'react';
import MultiStep from '@shared/multiStep';
import TransactionSignature from '@shared/transactionSignature';
import Dialog from '@toolbox/dialog/dialog';
import Form from './form';
import Summary from './summary';
import Status from './status';
import styles from './registerDelegate.css';

const RegisterDelegate = ({
  history,
}) => (
  <Dialog hasClose>
    <MultiStep
      className={styles.multiStep}
      prevPage={history.goBack}
      backButtonLabel="Back"
    >
      <Form />
      <Summary />
      <TransactionSignature />
      <Status />
    </MultiStep>
  </Dialog>
);

export default RegisterDelegate;
