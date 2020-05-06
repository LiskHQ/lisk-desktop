import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import BoxRow from '../../toolbox/box/row';
import styles from './transactionDetails.css';
import transactionTypes from '../../../constants/transactionTypes';
import { isEmpty } from '../../../utils/helpers';
import routes from '../../../constants/routes';
import RankOrStatus from '../../shared/rankOrStatus';

function addVotesWithDelegateNames(votes, delegates, t) {
  const getVotesStartingWith = sign => (
    votes
      .filter(item => item.startsWith(sign))
      .map(item => item.replace(sign, ''))
  );

  const getDelegate = publicKey => (
    delegates[publicKey] || { username: t('Loading...'), account: {} }
  );

  const votesNames = {
    added: getVotesStartingWith('+').map(getDelegate),
    removed: getVotesStartingWith('-').map(getDelegate),
  };
  return votesNames;
}

const transactionVotes = ({ t, transaction, delegates }) => {
  if (transaction.type !== transactionTypes().vote.code) return null;
  const accountPath = `${routes.accounts.pathPrefix}${routes.accounts.path}`;
  const [votesNames, setVoteNames] = useState(
    addVotesWithDelegateNames(transaction.asset.votes, delegates.data, t),
  );

  useEffect(() => {
    if (transaction.asset) {
      const publicKeys = transaction.asset.votes.map(item => item.replace(/\+|-/, ''));
      delegates.loadData({ publicKeys });
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(delegates.data)) {
      setVoteNames(addVotesWithDelegateNames(transaction.asset.votes, delegates.data, t));
    }
  }, [delegates]);

  return (
    <>
      {votesNames.added.length > 0
        ? (
          <BoxRow>
            <div className={styles.detailsWrapper}>
              <span className={styles.label}>
                {`${t('Added votes')} (${votesNames.added.length})`}
              </span>
              <div className={`${styles.votesContainer} ${styles.added} tx-added-votes`}>
                {votesNames.added.slice(0).sort((a, b) => a.rank - b.rank).map((vote, voteKey) => (
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
      {votesNames.removed.length > 0
        ? (
          <BoxRow>
            <div className={styles.detailsWrapper}>
              <span className={styles.label}>
                {`${t('Removed votes')} (${votesNames.removed.length})`}
              </span>
              <div className={`${styles.votesContainer} ${styles.deleted} tx-removed-votes`}>
                {votesNames.removed
                  .slice(0).sort((a, b) => a.rank - b.rank).map((vote, voteKey) => (
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
    </>
  );
};

export default withTranslation()(transactionVotes);
