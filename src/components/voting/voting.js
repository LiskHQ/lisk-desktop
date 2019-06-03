import React from 'react';
import VotingSummary from './votingSummary';
import VotingResult from './votingResult';
import MultiStep from '../multiStep';

import styles from './voting.css';

const VotingV2 = ({
  t, votes, history, account, votePlaced, voteLookupStatus,
}) => (
  <div className={styles.wrapper}>
    <MultiStep>
      <VotingSummary
        t={t}
        votes={votes}
        history={history}
        account={account}
        votePlaced={votePlaced}
        voteLookupStatus={voteLookupStatus}
      />
      <VotingResult
        t={t}
        account={account}
      />
    </MultiStep>
  </div>
);

export default VotingV2;
