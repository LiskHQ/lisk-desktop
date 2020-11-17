import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import BoxRow from '../../toolbox/box/row';
import styles from './transactionDetails.css';
import transactionTypes from '../../../constants/transactionTypes';
import LiskAmount from '../../shared/liskAmount';
import routes from '../../../constants/routes';
import { tokenMap } from '../../../constants/tokens';
import VoteItem from '../../shared/voteItem';

const transactionVotes = ({ t, transaction, delegates }) => {
  if (transaction.type !== transactionTypes().vote.code.legacy) return null;
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
          {votes.map((vote, i) => (
            <VoteItem
              key={i}
              vote={{ confirmed: vote.amount }}
              address={vote.delegateAddress}
              primaryText={vote.delegateAddress}
            />
          ))}
        </div>
      </div>
    </BoxRow>
  );
};

export default withTranslation()(transactionVotes);
