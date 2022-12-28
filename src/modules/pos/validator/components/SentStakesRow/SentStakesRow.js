import React from 'react';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './SentStakesRow.css';
import { ValidatorWalletVisual, Balance, Actions } from './components';

const SentStakeRow = ({ data: delegate, stakeEdited, dposToken }) => {
  const {
    delegateAddress,
    amount,
    name,
    rank,
    validatorWeight
  } = delegate;

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <ValidatorWalletVisual name={name} address={delegateAddress} />
        <Balance value={rank} />
        <Balance value={<TokenAmount val={validatorWeight} token={dposToken.symbol}/>} />
        <Balance value={<TokenAmount val={amount} token={dposToken.symbol}/>} />
        <Actions address={delegateAddress} name={name} stakeEdited={stakeEdited} />
      </div>
    </div>
  );
};

export default SentStakeRow;
