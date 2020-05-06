import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import BoxRow from '../../toolbox/box/row';
import styles from './transactions.css';
import transactionTypes from '../../../constants/transactionTypes';
import routes from '../../../constants/routes';
import RankOrStatus from '../../shared/rankOrStatus';

const transactionVotes = ({ t, transaction }) => {
  const { votesName, type } = transaction;
  const accountPath = `${routes.accounts.pathPrefix}${routes.accounts.path}`;
  if (type === transactionTypes().send.code || !votesName) return null;
  return (
    <React.Fragment>
      {votesName.added && votesName.added.length > 0
        ? (
          <BoxRow>
            <div className={styles.detailsWrapper}>
              <span className={styles.label}>
                {`${t('Added votes')} (${votesName.added.length})`}
              </span>
              <div className={`${styles.votesContainer} ${styles.added} tx-added-votes`}>
                {votesName.added.slice(0).sort((a, b) => a.rank - b.rank).map((vote, voteKey) => (
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
      {votesName.deleted && votesName.deleted.length > 0
        ? (
          <BoxRow>
            <div className={styles.detailsWrapper}>
              <span className={styles.label}>
                {`${t('Removed votes')} (${votesName.deleted.length})`}
              </span>
              <div className={`${styles.votesContainer} ${styles.deleted} tx-removed-votes`}>
                {votesName.deleted.slice(0).sort((a, b) => a.rank - b.rank).map((vote, voteKey) => (
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
