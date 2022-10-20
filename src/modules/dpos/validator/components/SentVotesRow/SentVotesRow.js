import React from 'react';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
import styles from './SentVotesRow.css';
import { DelegateWalletVisual, Balance, Actions } from './components';

const SentVoteRow = ({ data: delegate, voteEdited }) => {
  const {
    delegateAddress,
    amount,
    name,
  } = delegate;

  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <DelegateWalletVisual name={name} address={delegateAddress} />
        <Balance amount={fromRawLsk(amount)} />
        <Balance amount={fromRawLsk(amount)} />
        <Balance amount={fromRawLsk(amount)} />
        <Actions address={delegateAddress} voteEdited={voteEdited} />
      </div>
    </div>
  );
};

export default SentVoteRow;
