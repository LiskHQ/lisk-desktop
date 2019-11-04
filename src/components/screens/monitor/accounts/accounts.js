import React from 'react';
import MonitorHeader from '../header';
import AccountsTable from '../../../shared/accountsTable';

const MonitorAccounts = ({ t, transactions }) => (
  <div>
    <MonitorHeader />
    <AccountsTable
      isLoadMoreEnabled
      title={t('Accounts')}
      transactions={transactions}
      t={t}
    />
  </div>
);

export default MonitorAccounts;
