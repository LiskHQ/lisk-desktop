import React, { useMemo } from 'react';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
import Converter from 'src/modules/common/components/converter';
import styles from './TokenRow.css';
import { Token, Balance, LockedBalance } from './components';

const TokenRow = ({ data: token, address }) => {
  const {
    symbol: tokenSymbol,
    chainUrl,
    name: chainName,
    availableBalance,
    lockedBalances,
  } = token;

  const totalLockedBalance = useMemo(
    () => lockedBalances && lockedBalances.reduce((total, { amount }) => +amount + total, 0),
    [lockedBalances]
  );

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <Token chainName={chainName} chainLogo={chainUrl} tokenSymbol={tokenSymbol} />
        <Balance amount={fromRawLsk(+availableBalance + totalLockedBalance)} />
        <Balance amount={fromRawLsk(availableBalance)} />
        <Balance amount={<Converter value={fromRawLsk(availableBalance)} />} />
        <LockedBalance amount={fromRawLsk(totalLockedBalance)} address={address} />
      </div>
    </div>
  );
};

export default TokenRow;
