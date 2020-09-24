import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import BoxRow from '../../toolbox/box/row';
import styles from './transactionDetails.css';
import transactionTypes from '../../../constants/transactionTypes';
import LiskAmount from '../../shared/liskAmount';
import routes from '../../../constants/routes';
import { tokenMap } from '../../../constants/tokens';

const transactionVotes = ({ t, transaction, delegates }) => {
  if (transaction.type !== transactionTypes().vote.code) return null;
  const accountPath = routes.account.path;

  const { votes } = transaction.asset;

  useEffect(() => {
    if (transaction.asset) {
      const addressList = votes.map(item => item.delegateAddress);
      delegates.loadData({ addressList });
    }
  }, []);

  return (
    <BoxRow>
      <div className={styles.detailsWrapper}>
        <span className={styles.label}>
          {`${t('Votes')} (${votes.length})`}
        </span>
        <div className={`${styles.votesContainer} ${styles.added} tx-added-votes`}>
          {votes.map(vote => (
            <Link
              key={vote.delegateAddress}
              to={`${accountPath}?address=${vote.delegateAddress}`}
              className={`${styles.voteTag} voter-address`}
            >
              <span className={styles.username}>{delegates[vote.delegateAddress].username}</span>
              <span className={styles.voteAmount}>
                <LiskAmount val={vote.amount} token={tokenMap.LSK.key} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </BoxRow>
  );
};

export default withTranslation()(transactionVotes);
