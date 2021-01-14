import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import gridVisibility from 'flexboxgrid-helpers/dist/flexboxgrid-helpers.min.css';
import { DateTimeFromTimestamp } from '../../../../toolbox/timestamp';
import LiskAmount from '../../../../shared/liskAmount';
import AccountVisualWithAddress from '../../../../shared/accountVisualWithAddress';
import DialogLink from '../../../../toolbox/dialog/link';
import styles from '../delegates.css';

const VoteRow = ({
  data, className,
}) => (
/* const votes = data.votes
  .filter(vote => vote.status === '+')
  .map(vote => vote.delegate.username);
const unVotes = data.votes
  .filter(vote => vote.status === '-')
  .map(vote => vote.delegate.username); */
  <DialogLink
    className={`${grid.row} ${className} ${styles.voteRow} vote-row`}
    component="transactionDetails"
    data={{ transactionId: data.id, token: 'LSK' }}
  >
    <span className={grid['col-sm-3']}>
      <AccountVisualWithAddress
        address={data.senderId}
        transactionSubject="senderId"
        transactionType={3}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-sm-2']}>
      <DateTimeFromTimestamp time={data.timestamp * 1000} token="BTC" />
    </span>
    <span className={grid['col-sm-2']}>
      <LiskAmount val={data.balance} token="LSK" />
    </span>
    <span className={`${grid['col-lg-1']} ${gridVisibility['hidden-md']}  ${gridVisibility['hidden-sm']} ${gridVisibility['hidden-xs']}`}>
      <span>{Math.ceil(data.height / 101)}</span>
    </span>
    <span className={`${grid['col-sm-5']} ${grid['col-lg-4']} ${styles.votesColumn}`}>
      {/*
        votes.length ? (
          <span className={styles.vote}>
            <span className={styles.icon}>↑</span>
            <span className={styles.delegatesList}>
              {votes.map(username => <span key={username}>{username}</span>)}
            </span>
          </span>
        ) : null
      }
      {
        unVotes.length ? (
          <span className={styles.unVote}>
            <span className={styles.icon}>↓</span>
            <span className={styles.delegatesList}>
              {unVotes.map(username => <span key={username}>{username}</span>)}
            </span>
          </span>
        ) : null
        */}
    </span>
  </DialogLink>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (prevProps.data.id === nextProps.data.id);

export default React.memo(VoteRow, areEqual);
