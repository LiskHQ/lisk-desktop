import React from 'react';
import TransactionsList from '@transaction/components/TransactionMonitor';

import Overview from './overview';

const Transactions = () => (
  <div>
    <Overview />
    <TransactionsList />
  </div>
);

export default Transactions;
