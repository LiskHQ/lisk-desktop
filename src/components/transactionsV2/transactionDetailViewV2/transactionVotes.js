import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import styles from './transactionDetailViewV2.css';
import routes from '../../../constants/routes';

const transactionVotes = ({ votes, t }) => {
  const accountPath = `${routes.accounts.pathPrefix}${routes.accounts.path}`;
  return (
    <div className={styles.detailsWrapper}>
    {votes.added ?
      <React.Fragment>
        <span className={styles.label}>
          {t('Added Votes')} <span className={styles.count}>{votes.added.length}</span>
        </span>
        <div className={`${styles.votesContainer} ${styles.added} tx-added-votes`}>
          {votes.added.slice(0).sort((a, b) => a.rank - b.rank).map((vote, voteKey) => (
            <Link key={voteKey}
              to={`${accountPath}/${vote.account.address}`}
              className={`${styles.voteTag} voter-address`}>
              <span className={styles.rank}>{vote.rank}</span>
              <span className={styles.username}>{vote.username}</span>
            </Link>
          ))}
        </div>
      </React.Fragment> : null}
    {votes.deleted ?
      <React.Fragment>
        <span className={styles.label}>
          {t('Removed Votes')} <span className={styles.count}>{votes.deleted.length}</span>
        </span>
        <div className={`${styles.votesContainer} ${styles.deleted} tx-removed-votes`}>
          {votes.deleted.slice(0).sort((a, b) => a.rank - b.rank).map((vote, voteKey) => (
            <Link key={voteKey}
              to={`${accountPath}/${vote.account.address}`}
              className={`${styles.voteTag} voter-address`}>
              <span className={styles.rank}>{vote.rank}</span>
              <span className={styles.username}>{vote.username}</span>
            </Link>
          ))}
        </div>
      </React.Fragment> : null}
    </div>
  );
};

export default translate()(transactionVotes);
