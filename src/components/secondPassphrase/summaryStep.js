import React from 'react';

import { fromRawLsk } from '../../utils/lsk';
import AccountVisual from '../accountVisual';
import Fees from '../../constants/fees';
import TransactionSummary from '../transactionSummary';

const SummaryStep = ({
  t, account, prevStep, registerSecondPassphrase,
}) => (
  <TransactionSummary
    title={t('Register 2nd passphrase summary')}
    account={account}
    t={t}
    confirmButton={{
      label: t('Register'),
      onClick: () => {
        registerSecondPassphrase();
      },
    }}
    cancelButton={{
      label: t('Go back'),
      onClick: prevStep,
    }}
    fee={fromRawLsk(Fees.setSecondPassphrase)}
    confirmation={t('I’m aware registering a 2nd passphrase is irreversible and it will be required to confirm transactions.')}
  >
   <section>
    <label>{t('Account')}</label>
    <label>
      <AccountVisual address={account.address} size={25} />
      {account.address}
    </label>
   </section>
  </TransactionSummary>
);

export default SummaryStep;
