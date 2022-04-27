
import React from 'react';
import TransactionsList from '@transaction/list/managers/transactionMonitor';

import Overview from './overview';

const Transactions = () => (
  <div>
    <Overview />
    <TransactionsList />
  </div>
);

export default Transactions;
