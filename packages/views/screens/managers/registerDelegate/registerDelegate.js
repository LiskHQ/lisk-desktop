import React from 'react';
import MultiStep from '@shared/multiStep';
import TransactionSignature from '@shared/transactionSignature';
import Dialog from '@views/basics/dialog/dialog';
import Form from './form';
import Summary from './summary';
import Status from './status';
import styles from './registerDelegate.css';

const RegisterDelegate = ({
  history, t,
}) => (
  <Dialog hasClose>
    <MultiStep
      className={styles.multiStep}
      prevPage={history.goBack}
      backButtonLabel={t('Back')}
    >
      <Form t={t} />
      <Summary t={t} />
      <TransactionSignature t={t} />
      <Status t={t} />
    </MultiStep>
  </Dialog>
);

export default RegisterDelegate;
