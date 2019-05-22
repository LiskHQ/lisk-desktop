import React from 'react';
import VotingSummary from './votingSummary';
import VotingResult from './votingResult';
import MultiStep from '../multiStep';

import styles from './votingV2.css';

const VotingV2 = ({
  t, votes, history, account,
}) => (
  <div className={styles.wrapper}>
    <MultiStep>
      <VotingSummary
        t={t}
        votes={votes}
        history={history}
        account={account}
      />
      <VotingResult
        t={t}
        account={account}
      />
    </MultiStep>
  </div>
);

export default VotingV2;
