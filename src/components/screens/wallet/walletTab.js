import React from 'react';
import Overview from './overview';
import Transactions from './transactions';

const WalletTab = ({
  host,
  account,
  t,
  activeToken,
  discreetMode,
  transactions,
  pending,
  hwInfo,
}) => (
  <>
    <Overview
      t={t}
      address={host}
      hwInfo={hwInfo}
      balance={account ? account.balance : 0}
      activeToken={activeToken}
      transactions={transactions.data}
      discreetMode={discreetMode}
    />
    <Transactions
      transactions={transactions}
      host={host}
      activeToken={activeToken}
      t={t}
      pending={pending || []}
    />
  </>
);

export default WalletTab;
