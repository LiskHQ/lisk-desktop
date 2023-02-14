import React from 'react';
import classNames from 'classnames';
import { getLogo } from '@token/fungible/utils/service';
import styles from './RewardsClaimableRow.css';

const RewardsClaimableRow = ({ data, rewardsClaimableHeader }) => {
  const { tokenName, logo, reward, symbol, denomUnits, displayDenom } = data;
  const amountInFiat = reward;
  const denom = denomUnits?.find((denomUnit) => denomUnit.denom === displayDenom);
  const logoUrl = getLogo({ logo });

  return (
    <div className={classNames(styles.RewardsClaimableRow)}>
      <div className={classNames(styles.logoContainer, rewardsClaimableHeader[0].classList)}>
        <img className={styles.logo} src={logoUrl} />
        <span className={styles.tokenName}>{tokenName}</span>
      </div>
      <div className={classNames(rewardsClaimableHeader[1].classList)}>
        {`${parseInt(reward, denom)} ${symbol}`}
      </div>
      <div className={classNames(rewardsClaimableHeader[2].classList)}>{amountInFiat}</div>
    </div>
  );
};

export default RewardsClaimableRow;
