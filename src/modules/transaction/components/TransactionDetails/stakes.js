import React, { useEffect } from 'react';
import withData from 'src/utils/withData';
import { getValidators } from '@pos/validator/api';
import usePosToken from '@pos/validator/hooks/usePosToken';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';
import StakeItem from '../StakeItem';

export const StakesPure = ({ t, stakedValidator }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  const { stakes } = transaction.params;
  const { token } = usePosToken();

  useEffect(() => {
    if (transaction.params) {
      const addressList = stakes.map((item) => item.validatorAddress);
      stakedValidator.loadData({ addressList });
    }
  }, []);

  return (
    <div className={`${styles.stakeValue}`}>
      <div className={styles.detailsWrapper}>
        <span className={styles.label}>{`${t('Stakes')} (${stakes.length})`}</span>
        <div className={`${styles.stakesContainer} ${styles.added} tx-added-stakes`}>
          {stakes.map(({ validatorAddress, amount }) => (
            <StakeItem
              truncate
              key={`stake-${validatorAddress}`}
              stake={{ confirmed: amount }}
              address={validatorAddress}
              token={token}
              title={
                stakedValidator.data[validatorAddress] &&
                stakedValidator.data[validatorAddress].pos?.validator?.name
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default withData({
  stakedValidator: {
    apiUtil: ({ networks }, params) => getValidators({ network: networks.LSK, params }),
    defaultData: {},
    transformResponse: (response) =>
      response.data.reduce((acc, validator) => {
        acc[validator.summary?.address] = validator;
        return acc;
      }, {}),
  },
})(StakesPure);
