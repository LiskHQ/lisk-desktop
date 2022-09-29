/* istanbul ignore file */
import React from 'react';
import TransactionsList from '../TransactionMonitor';
import Overview from '../Overview';

const Transactions = () => (
  <div>
    <Overview />
    <TransactionsList />
  </div>
);

export default Transactions;
