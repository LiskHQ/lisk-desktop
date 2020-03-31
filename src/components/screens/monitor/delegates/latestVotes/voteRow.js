import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../../../../constants/routes';
import { DateTimeFromTimestamp } from '../../../../toolbox/timestamp';
import LiskAmount from '../../../../shared/liskAmount';
import AccountVisualWithAddress from '../../../../shared/accountVisualWithAddress';
import styles from '../delegates.css';

const VoteRow = ({
  data, className,
}) => {
  const votes = data.votes
    .filter(vote => vote.status === '+')
    .map(vote => vote.delegate.username);
  const unVotes = data.votes
    .filter(vote => vote.status === '-')
    .map(vote => vote.delegate.username);
  return (
    <Link
      className={`${grid.row} ${className} ${styles.voteRow} vote-row`}
      to={`${routes.transactions.path}/${data.id}`}
    >
      <span className={grid['col-md-3']}>
        <AccountVisualWithAddress
          address={data.senderId}
          transactionSubject="senderId"
          transactionType={3}
          showBookmarkedAddress
        />
      </span>
      <span className={grid['col-md-2']}>
        <DateTimeFromTimestamp time={data.timestamp * 1000} token="BTC" />
      </span>
      <span className={grid['col-md-2']}>
        <LiskAmount val={data.balance} token="LSK" />
      </span>
      <span className={grid['col-md-1']}>
        <span>{data.height}</span>
      </span>
      <span className={`${grid['col-md-4']} ${styles.votesColumn}`}>
        {
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
        }
      </span>
    </Link>
  );
};

export default React.memo(VoteRow);
