import React from 'react';
import classNames from 'classnames';
import { convertFromBaseDenom, getLogo } from '@token/fungible/utils/helpers';
import Converter from '@common/components/converter';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { useValidators } from '@pos/validator/hooks/queries';
import { ValidatorWalletVisual } from '@pos/validator/components/SentStakesRow/components';
import styles from './RewardsClaimableRow.css';

const RewardsClaimableRow = ({ data: validatorsWithTokenData, rewardsClaimableHeader }) => {
  const { validatorAddress, tokenName, logo, amount, symbol } = validatorsWithTokenData;

  const { data: validators } = useValidators({
    config: { params: { address: validatorAddress } },
  });
  const { name } = validators?.data?.[0] || {};

  return (
    <div className={classNames(styles.RewardsClaimableRow)}>
      <div
        className={classNames(
          styles.validatorWalletVisualContainer,
          rewardsClaimableHeader[0].classList
        )}
      >
        <ValidatorWalletVisual
          className={styles.validatorWalletVisualProp}
          name={name}
          address={validatorAddress}
        />
      </div>
      <div className={classNames(styles.logoContainer, rewardsClaimableHeader[1].classList)}>
        <img className={styles.logo} src={getLogo({ logo })} />
        <span className={styles.tokenName}>{tokenName}</span>
      </div>
      <div className={classNames(rewardsClaimableHeader[2].classList)}>
        <TokenAmount val={amount} token={validatorsWithTokenData} />
      </div>
      <div className={classNames(rewardsClaimableHeader[3].classList)}>
        <Converter
          emptyPlaceholder="-"
          className={styles.fiatBalance}
          value={convertFromBaseDenom(amount, validatorsWithTokenData)}
          tokenSymbol={symbol}
        />
      </div>
    </div>
  );
};

export default RewardsClaimableRow;
