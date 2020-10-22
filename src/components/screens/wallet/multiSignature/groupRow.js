import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../../../toolbox/accountVisual';
import LiskAmount from '../../../shared/liskAmount';
import { tokenMap } from '../../../../constants/tokens';
import styles from './multiSignature.css';

const GroupRow = ({
  data, className,
}) => {
  const {
    address,
    name,
    key,
    balance,
  } = data;

  return (
    <div className={`${grid.row} ${className} ${styles.transactionRow} multisign-group-row`}>
      <span className={grid['col-xs-8']}>
        <AccountVisual
          address={address}
          className={styles.avatar}
        />
        <div className={styles.senderDetails}>
          <p className={styles.addressTitle}>
            {name || address}
          </p>
          <p className={styles.senderKey}>
            {key && key}
          </p>
        </div>
      </span>
      <span className={grid['col-xs-4']}>
        <span className={styles.groupBalance}>
          <LiskAmount
            val={balance}
            showRounded
            token={tokenMap.LSK.key}
          />
        </span>
      </span>
    </div>
  );
};

export default GroupRow;
