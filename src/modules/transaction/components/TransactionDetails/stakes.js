import React, { useEffect } from 'react';
import withData from 'src/utils/withData';
import { getValidators } from '@pos/validator/api';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';
import StakeItem from '../StakeItem';

export const StakesPure = ({ t, votedDelegates }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  const { stakes } = transaction.params;

  useEffect(() => {
    if (transaction.params) {
      const addressList = stakes.map((item) => item.validatorAddress);
      votedDelegates.loadData({ addressList });
    }
  }, []);

  return (
    <div className={`${styles.stakeValue}`}>
      <div className={styles.detailsWrapper}>
        <span className={styles.label}>{`${t('Stakes')} (${stakes.length})`}</span>
        <div className={`${styles.stakesContainer} ${styles.added} tx-added-stakes`}>
          {stakes.map((vote) => (
            <StakeItem
              key={`stake-${vote.validatorAddress}`}
              vote={{ confirmed: vote.amount }}
              address={vote.validatorAddress}
              truncate
              title={
                votedDelegates.data[vote.validatorAddress] &&
                votedDelegates.data[vote.validatorAddress].pos?.validator?.username
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
    transformResponse: (response) =>
      response.data.reduce((acc, validator) => {
        acc[validator.summary?.address] = validator;
        return acc;
      }, {}),
  },
})(StakesPure);
