import React from 'react';
import MonitorHeader from '../header';
import AccountsTable from '../../../shared/accountsTable';

const MonitorAccounts = ({ t, accounts }) => (
  <div>
    <MonitorHeader />
    <AccountsTable
      isLoadMoreEnabled
      title={t('Accounts')}
      accounts={accounts}
      t={t}
    />
  </div>
);

export default MonitorAccounts;
