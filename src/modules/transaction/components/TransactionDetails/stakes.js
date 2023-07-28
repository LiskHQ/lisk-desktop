import React from 'react';
import { useValidators } from '@pos/validator/hooks/queries';
import usePosToken from '@pos/validator/hooks/usePosToken';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';
import StakeItem from '../StakeItem';

export const StakesPure = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  const { stakes } = transaction.params;
  const { token } = usePosToken();
  const addressList = stakes.map((item) => item.validatorAddress);
  const { data: validatorsData } = useValidators({
    config: { params: { address: addressList.join() } },
  });

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
              title={validatorsData?.data?.find((v) => v.address === validatorAddress)?.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StakesPure;
