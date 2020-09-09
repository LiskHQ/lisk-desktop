import React from 'react';
import MultiStep from '../../shared/multiStep';
import SelectNameAndFee from './selectNameAndFee/selectNameAndFee';
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
  <section className={`${styles.wrapper}`}>
    <MultiStep
      className={styles.multiStep}
      prevPage={history.goBack}
      backButtonLabel={t('Back')}
    >
      <SelectNameAndFee
        t={t}
        account={account}
        network={network}
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
  </section>
);

export default RegisterDelegate;
