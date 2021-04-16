import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import BoxRow from '@toolbox/box/row';
import styles from './transactionDetails.css';
import VoteItem from '@shared/voteItem';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';

const transactionVotes = ({ t, transaction, votedDelegates }) => {
  if (transaction.moduleAssetId !== MODULE_ASSETS_NAME_ID_MAP.voteDelegate) {
    return null;
  }

  useEffect(() => {
    if (transaction.moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.voteDelegate) {
      const votesList = transaction.asset.votes || [];
      const addressList = votesList.map(vote => vote.delegateAddress);
      if (addressList.length > 0) {
        votedDelegates.loadData({ addressList });
      }
    }
  }, [transaction]);

  const { votes } = transaction.asset;

  return (
    <BoxRow>
      <div className={styles.detailsWrapper}>
        <span className={styles.label}>
          {`${t('Votes')} (${votes.length})`}
        </span>
        <div className={`${styles.votesContainer} ${styles.added} tx-added-votes`}>
          {votes.map(vote => (
            <VoteItem
              key={`vote-${vote.delegateAddress}`}
              vote={{ confirmed: vote.amount }}
              address={vote.delegateAddress}
              title={
                votedDelegates.data[vote.delegateAddress]
                && votedDelegates.data[vote.delegateAddress].username
              }
            />
          ))}
        </div>
      </div>
    </BoxRow>
  );
};

export default withTranslation()(transactionVotes);
