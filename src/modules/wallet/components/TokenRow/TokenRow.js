import React, { useMemo } from 'react';
import numeral from 'numeral';
import { convertFromRawDenom } from 'src/modules/token/fungible/utils/lsk';
import Converter from 'src/modules/common/components/converter';
import styles from './TokenRow.css';
import { Token, Balance } from './components';

const TokenRow = ({ data: token }) => {
  const { symbol: tokenSymbol, logo, chainName, availableBalance, lockedBalances } = token;

  const totalLockedBalance = useMemo(
    () => lockedBalances && lockedBalances.reduce((total, { amount }) => +amount + total, 0),
    [lockedBalances]
  );

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <Token chainName={chainName} chainLogo={logo?.svg} tokenSymbol={tokenSymbol} />
        <Balance
          amount={numeral(
            convertFromRawDenom(+availableBalance + totalLockedBalance, token)
          ).format('0,0.00')}
        />
        <Balance amount={numeral(convertFromRawDenom(availableBalance, token)).format('0,0.00')} />
        <Balance amount={numeral(convertFromRawDenom(totalLockedBalance, token)).format('0')} />
        <Balance amount={<Converter value={convertFromRawDenom(availableBalance, token)} />} />
      </div>
    </div>
  );
};

export default TokenRow;
