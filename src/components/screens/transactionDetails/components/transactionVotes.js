import React, { useContext, useEffect } from 'react';

import VoteItem from '@shared/voteItem';
import withData from '@utils/withData';
import { getDelegates } from '@api/delegate';
import { Context } from '../transactionDetails';
import styles from './styles.css';

const TransactionVotes = ({ t, votedDelegates }) => {
  const { transaction, delegates } = useContext(Context);
  const { votes } = transaction.asset;

  useEffect(() => {
    if (transaction.asset) {
      const addressList = votes.map(item => item.delegateAddress);
      delegates.loadData({ addressList });
    }
  }, []);

  return (
    <div className={`${styles.value} ${styles.votes}`}>
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
    </div>
  );
};

export default withData({
  votedDelegates: {
    apiUtil: ({ networks }, params) => getDelegates({ network: networks.LSK, params }),
    defaultData: {},
    transformResponse: (response) => {
      const responseMap = response.data.reduce((acc, delegate) => {
        acc[delegate.address] = delegate.summary?.address;
        return acc;
      }, {});

      return responseMap;
    },
  },
})(TransactionVotes);
