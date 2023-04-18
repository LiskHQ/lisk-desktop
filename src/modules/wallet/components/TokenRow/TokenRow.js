import React, { useMemo } from 'react';
import numeral from 'numeral';
import { convertFromBaseDenom, getLogo } from '@token/fungible/utils/helpers';
import Converter from '@common/components/converter';
import styles from './TokenRow.css';
import { Token, Balance } from './components';

const TokenRow = ({ data: token }) => {
  const { symbol: tokenSymbol, logo, chainName, availableBalance, lockedBalances } = token;

  const totalLockedBalance = useMemo(
    () => lockedBalances && lockedBalances.reduce((total, { amount }) => +amount + total, 0),
    [lockedBalances]
  );

  const chainLogo = getLogo({ logo });

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <Token chainName={chainName} chainLogo={chainLogo} tokenSymbol={tokenSymbol} />
        <Balance
          amount={numeral(
            convertFromBaseDenom(+availableBalance + totalLockedBalance, token)
          ).format('0,0.00')}
        />
        <Balance amount={numeral(convertFromBaseDenom(availableBalance, token)).format('0,0.00')} />
        <Balance amount={numeral(convertFromBaseDenom(totalLockedBalance, token)).format('0')} />
        <Balance
          amount={
            <Converter
              emptyPlaceholder='-'
              value={convertFromBaseDenom(availableBalance, token)}
              tokenSymbol={token.symbol}
            />
          }
        />
      </div>
    </div>
  );
};

export default TokenRow;
