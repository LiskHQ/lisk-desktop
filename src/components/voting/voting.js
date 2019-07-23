import React from 'react';
import VotingSummary from './votingSummary';
import TransactionResult from '../transactionResult';
import MultiStep from '../multiStep';

import styles from './voting.css';

const VotingV2 = ({
  t, votes, history, account, votePlaced,
}) => (
  <div className={styles.wrapper}>
    <MultiStep>
      <VotingSummary
        t={t}
        votes={votes}
        history={history}
        account={account}
        votePlaced={votePlaced}
      />
      <TransactionResult t={t} />
    </MultiStep>
  </div>
);

export default VotingV2;
