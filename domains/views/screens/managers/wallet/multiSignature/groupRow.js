import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import AccountVisual from '@toolbox/accountVisual';
import LiskAmount from '@shared/liskAmount';
import { tokenMap, routes, regex } from '@constants';
import styles from './multiSignature.css';

const GroupRow = ({ data, className }) => {
  const {
    address,
    name,
    key,
    balance,
  } = data;

  return (
    <Link
      to={`${routes.account.path}?address=${address}`}
      className={`${grid.row} ${className} ${styles.transactionRow} multisign-group-row`}
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
    </Link>
  );
};

export default GroupRow;
