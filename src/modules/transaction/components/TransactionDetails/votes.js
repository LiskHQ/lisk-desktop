import React, { useEffect } from 'react';
import withData from 'src/utils/withData';
import { getValidators } from '@pos/validator/api';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';
import VoteItem from '../VoteItem';

export const VotesPure = ({ t, votedDelegates }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  const { votes } = transaction.params;

  useEffect(() => {
    if (transaction.params) {
      const addressList = votes.map((item) => item.delegateAddress);
      votedDelegates.loadData({ addressList });
    }
  }, []);

  return (
    <div className={`${styles.voteValue} ${styles.votes}`}>
      <div className={styles.detailsWrapper}>
        <span className={styles.label}>{`${t('Votes')} (${votes.length})`}</span>
        <div className={`${styles.votesContainer} ${styles.added} tx-added-votes`}>
          {votes.map((vote) => (
            <VoteItem
              key={`vote-${vote.delegateAddress}`}
              vote={{ confirmed: vote.amount }}
              address={vote.delegateAddress}
              truncate
              title={
                votedDelegates.data[vote.delegateAddress] &&
                votedDelegates.data[vote.delegateAddress].dpos?.delegate?.username
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
    apiUtil: ({ networks }, params) => getValidators({ network: networks.LSK, params }),
    defaultData: {},
    transformResponse: (response) => {
      const responseMap = response.data.reduce((acc, delegate) => {
        acc[delegate.summary?.address] = delegate;
        return acc;
      }, {});

      return responseMap;
    },
  },
})(VotesPure);
