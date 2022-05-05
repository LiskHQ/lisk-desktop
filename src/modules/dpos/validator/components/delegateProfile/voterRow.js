import React from 'react';

import { Link } from 'react-router-dom';
import WalletVisual from '@wallet/components/walletVisual';
import { truncateAddress } from '@wallet/utils/account';
import styles from './delegateProfile.css';

const VoterRow = ({ data = {} }) => {
  const { address, username } = data;
  return (
    <Link
      className={styles.voteRow}
      to={`account?address=${address}`}
    >
      <WalletVisual
        className={styles.walletVisual}
        address={address}
        size={40}
      />
      <span className={styles.address}>{username || truncateAddress(address)}</span>
    </Link>
  );
};

export default VoterRow;
