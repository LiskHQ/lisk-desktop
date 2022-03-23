import React from 'react';

import { Link } from 'react-router-dom';
import AccountVisual from '@basics/accountVisual';
import { truncateAddress } from '@wallet/utilities/account';
import styles from './delegateProfile.css';

const VoterRow = ({ data = {} }) => {
  const { address, username } = data;
  return (
    <Link
      className={styles.voteRow}
      to={`account?address=${address}`}
    >
      <AccountVisual
        className={styles.accountVisual}
        address={address}
        size={40}
      />
      <span className={styles.address}>{username || truncateAddress(address)}</span>
    </Link>
  );
};

export default VoterRow;
