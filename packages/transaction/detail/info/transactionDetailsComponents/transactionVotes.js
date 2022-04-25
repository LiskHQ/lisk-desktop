import React, { useContext, useEffect } from 'react';

import VoteItem from '@transaction/list/row/voteItem';
import withData from '@common/utilities/withData';
import { getDelegates } from '@dpos/utilities/api';
import TransactionDetailsContext from '../../../configuration/context';
import styles from './styles.css';

export const TransactionVotesComp = ({ t, votedDelegates }) => {
  const { transaction } = useContext(TransactionDetailsContext);
  const { votes } = transaction.asset;

  useEffect(() => {
    if (transaction.asset) {
      const addressList = votes.map(item => item.delegateAddress);
      votedDelegates.loadData({ addressList });
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
              truncate
              title={
                votedDelegates.data[vote.delegateAddress]
                && votedDelegates.data[vote.delegateAddress].dpos?.delegate?.username
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
        acc[delegate.summary?.address] = delegate;
        return acc;
      }, {});

      return responseMap;
    },
  },
})(TransactionVotesComp);
