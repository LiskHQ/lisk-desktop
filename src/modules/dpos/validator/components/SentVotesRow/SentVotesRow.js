import React from 'react';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './SentVotesRow.css';
import { DelegateWalletVisual, Balance, Actions } from './components';

const SentVoteRow = ({ data: delegate, voteEdited, dposToken }) => {
  const {
    delegateAddress,
    amount,
    name,
    rank,
    voteWeight
  } = delegate;

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <DelegateWalletVisual name={name} address={delegateAddress} />
        <Balance value={rank} />
        <Balance value={<TokenAmount val={voteWeight} token={dposToken.symbol}/>} />
        <Balance value={<TokenAmount val={amount} token={dposToken.symbol}/>} />
        <Actions address={delegateAddress} voteEdited={voteEdited} />
      </div>
    </div>
  );
};

export default SentVoteRow;
