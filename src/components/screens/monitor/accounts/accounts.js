import React from 'react';
import MonitorHeader from '../header';
import AccountsTable from './accountsTable';

const MonitorAccounts = ({ t, accounts, networkStatus }) => (
  <div>
    <MonitorHeader />
    <AccountsTable
      isLoadMoreEnabled
      title={t('Accounts')}
      accounts={accounts}
      networkStatus={networkStatus}
      t={t}
    />
  </div>
);

export default MonitorAccounts;
