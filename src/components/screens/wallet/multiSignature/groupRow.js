import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../../../toolbox/accountVisual';
import LiskAmount from '../../../shared/liskAmount';
import { tokenMap } from '../../../../constants/tokens';
import regex from '../../../../utils/regex';
import styles from './multiSignature.css';

const GroupRow = ({
  data, className, selectedGroupId, setSelectedGroupId,
}) => {
  const {
    id,
    address,
    name,
    key,
    balance,
  } = data;

  const handleClick = () => {
    setSelectedGroupId(id);
  };

  return (
    <div
      className={`${grid.row} ${className} ${styles.transactionRow} ${selectedGroupId === id && styles.selected} multisign-group-row`}
      onClick={handleClick}
    >
      <span className={grid['col-xs-8']}>
        <AccountVisual
          address={address}
          className={styles.avatar}
        />
        <div className={styles.signDetails}>
          <p className={styles.addressTitle}>
            {name || address.replace(regex.lskAddressTrunk, '$1...$3')}
          </p>
          {key && <p className={styles.key}>{key.replace(regex.lskAddressTrunk, '$1...$3')}</p>}
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
