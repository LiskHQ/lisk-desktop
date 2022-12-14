import React from 'react';
import { Link } from 'react-router-dom';
import WalletVisual from '@wallet/components/walletVisual';
import { truncateAddress } from '@wallet/utils/account';
import styles from './ValidatorProfile.css';

const StakerRow = ({ data = {} }) => {
  const { delegateAddress, name } = data;

  return (
    <Link className={styles.stakerRow} to={`/explorer?address=${delegateAddress}`}>
      <WalletVisual className={styles.walletVisual} address={delegateAddress} size={40} />
      <span className={styles.address}>{name || truncateAddress(delegateAddress)}</span>
    </Link>
  );
};

export default StakerRow;
