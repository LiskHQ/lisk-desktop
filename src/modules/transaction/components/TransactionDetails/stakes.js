import React, { useEffect } from 'react';
import withData from 'src/utils/withData';
import { getValidators } from '@pos/validator/api';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';
import StakeItem from '../StakeItem';

export const StakesPure = ({ t, votedDelegates }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  const { votes } = transaction.params;

  useEffect(() => {
    if (transaction.params) {
      const addressList = votes.map((item) => item.delegateAddress);
      votedDelegates.loadData({ addressList });
    }
  }, []);

  return (
    <div className={`${styles.stakeValue}`}>
      <div className={styles.detailsWrapper}>
        <span className={styles.label}>{`${t('Stakes')} (${votes.length})`}</span>
        <div className={`${styles.stakesContainer} ${styles.added} tx-added-stakes`}>
          {votes.map((vote) => (
            <StakeItem
              key={`stake-${vote.delegateAddress}`}
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
})(StakesPure);
