import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import BoxRow from '../../../../toolbox/box/row';
import styles from './transactionDetailView.css';
import routes from '../../../../../constants/routes';
import RankOrStatus from '../../../../shared/rankOrStatus';

const transactionVotes = ({ votes, t }) => {
  const accountPath = `${routes.accounts.pathPrefix}${routes.accounts.path}`;
  return (
    <React.Fragment>
      {votes.added && votes.added.length > 0
        ? (
          <BoxRow>
            <div className={styles.detailsWrapper}>
              <span className={styles.label}>
                {`${t('Added votes')} (${votes.added.length})`}
              </span>
              <div className={`${styles.votesContainer} ${styles.added} tx-added-votes`}>
                {votes.added.slice(0).sort((a, b) => a.rank - b.rank).map((vote, voteKey) => (
                  <Link
                    key={voteKey}
                    to={`${accountPath}/${vote.account.address}`}
                    className={`${styles.voteTag} voter-address`}
                  >
                    <RankOrStatus data={vote} className={styles.rank} />
                    <span className={styles.username}>{vote.username}</span>
                  </Link>
                ))}
              </div>
            </div>
          </BoxRow>
        ) : null}
      {votes.deleted && votes.deleted.length > 0
        ? (
          <BoxRow>
            <div className={styles.detailsWrapper}>
              <span className={styles.label}>
                {`${t('Removed votes')} (${votes.deleted.length})`}
              </span>
              <div className={`${styles.votesContainer} ${styles.deleted} tx-removed-votes`}>
                {votes.deleted.slice(0).sort((a, b) => a.rank - b.rank).map((vote, voteKey) => (
                  <Link
                    key={voteKey}
                    to={`${accountPath}/${vote.account.address}`}
                    className={`${styles.voteTag} voter-address`}
                  >
                    <RankOrStatus data={vote} className={styles.rank} />
                    <span className={styles.username}>{vote.username}</span>
                  </Link>
                ))}
              </div>
            </div>
          </BoxRow>
        ) : null}
    </React.Fragment>
  );
};

export default withTranslation()(transactionVotes);
