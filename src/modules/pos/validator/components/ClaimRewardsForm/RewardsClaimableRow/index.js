import React from 'react';
import classNames from 'classnames';
import { convertFromBaseDenom, getLogo } from '@token/fungible/utils/helpers';
import Converter from '@common/components/converter';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './RewardsClaimableRow.css';

const RewardsClaimableRow = ({ data: token, rewardsClaimableHeader }) => {
  const { tokenName, logo, reward, symbol } = token;
  const logoUrl = getLogo({ logo });

  return (
    <div className={classNames(styles.RewardsClaimableRow)}>
      <div className={classNames(styles.logoContainer, rewardsClaimableHeader[0].classList)}>
        <img className={styles.logo} src={logoUrl} />
        <span className={styles.tokenName}>{tokenName}</span>
      </div>
      <div className={classNames(rewardsClaimableHeader[1].classList)}>
        <TokenAmount val={reward} token={token} />
      </div>
      <div className={classNames(rewardsClaimableHeader[2].classList)}>
        <Converter
          className={styles.fiatBalance}
          value={convertFromBaseDenom(reward, token)}
          tokenSymbol={symbol}
        />
      </div>
    </div>
  );
};

export default RewardsClaimableRow;
