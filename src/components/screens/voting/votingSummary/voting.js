import React from 'react';
import VotingSummary from './votingSummary';
import TransactionResult from '../../../shared/transactionResult';
import MultiStep from '../../../shared/multiStep';
import Dialog from '../../../toolbox/dialog/dialog';
import styles from './voting.css';

const Voting = ({
  t, votes, history, account, votePlaced,
}) => (
  <Dialog hasClose className={styles.wrapper}>
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
  </Dialog>
);

export default Voting;
