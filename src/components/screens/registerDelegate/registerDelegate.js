import React from 'react';
import MultiStep from '@shared/multiStep';
import Dialog from '@toolbox/dialog/dialog';
import Form from './form';
import Summary from './summary/summary';
import Status from './status/status';
import styles from './registerDelegate.css';

const RegisterDelegate = ({
  account,
  transactions,
  history,
  network,
  transactionBroadcasted,
  t,
}) => (
  <Dialog hasClose>
    <MultiStep
      className={styles.multiStep}
      prevPage={history.goBack}
      backButtonLabel={t('Back')}
    >
      <Form
        t={t}
        account={account}
        network={network}
        signedTransaction={transactions.signedTransaction}
        txSignatureError={transactions.txSignatureError}
      />
      <Summary
        t={t}
        account={account}
        network={network}
      />
      <Status
        t={t}
        transactionBroadcasted={transactionBroadcasted}
        transactions={transactions}
      />
    </MultiStep>
  </Dialog>
);

export default RegisterDelegate;
