import React from 'react';
import styles from './TokenRow.css';
import { Token, Balance, LockedBalance } from './components';

const TransactionEventRow = ({ data: token }) => {
  const {
    tokenSymbol,
    chainUrl,
    chainName,
    totalBalance,
    availableBalance,
    fiatBalance,
    lockedBalance,
  } = token;

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <Token chainName={chainName} chainLogo={chainUrl} tokenSymbol={tokenSymbol} />
        <Balance amount={totalBalance} />
        <Balance amount={availableBalance} />
        <Balance amount={fiatBalance} />
        <LockedBalance amount={lockedBalance} onClick={() => {}} />
      </div>
    </div>
  );
};

export default TransactionEventRow;
