import React from 'react';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { useValidators } from '@pos/validator/hooks/queries';
import { Actions, Balance, ValidatorWalletVisual } from './components';
import styles from './SentStakesRow.css';

const SentStakeRow = ({ data: stakes, stakeEdited, token }) => {
  const {
    address: validatorAddress,
    amount,
  } = stakes;
  const { data: validators, isLoading: isLoadingValidators } = useValidators({
    config: { params: { address: validatorAddress } },
  });
  const { name, rank, validatorWeight, commission } = !isLoadingValidators ? validators?.data[0] : {};


  return (
    <div data-testid="transaction-event-row-wrapper" className={styles.rowWrapper}>
      <div className={`transaction-event-row ${styles.container}`}>
        <ValidatorWalletVisual name={name} address={validatorAddress} />
        <Balance colSpanXs={1} value={`#${rank}`} />
        <Balance value={<TokenAmount val={validatorWeight} token={token.symbol}/>} />
        <Balance value={`${commission / 100}%`} />
        <Balance className={styles.amountCell} value={<TokenAmount val={amount} token={token.symbol}/>} />
        <Actions address={validatorAddress} name={name} stakeEdited={stakeEdited} />
      </div>
    </div>
  );
};

export default SentStakeRow;
