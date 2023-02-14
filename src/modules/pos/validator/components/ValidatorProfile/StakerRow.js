import React from 'react';
import { Link } from 'react-router-dom';
import WalletVisual from '@wallet/components/walletVisual';
import { truncateAddress } from '@wallet/utils/account';
import styles from './ValidatorProfile.css';

const StakerRow = ({ data = {} }) => {
  const { address, name } = data;

  return (
    <Link className={styles.stakerRow} to={`/explorer?address=${address}`}>
      <WalletVisual className={styles.walletVisual} address={address} size={40} />
      <span className={styles.address}>{name || truncateAddress(address)}</span>
    </Link>
  );
};

export default StakerRow;
