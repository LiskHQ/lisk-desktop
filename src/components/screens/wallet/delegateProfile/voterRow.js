import React from 'react';

import AccountVisual from '@toolbox/accountVisual';
import { truncateAddress } from '@utils/account';
import styles from './delegateProfile.css';

const VoterRow = ({ data = {} }) => {
  const { address, username } = data;
  return (
    <div className={styles.voteRow}>
      <AccountVisual
        className={styles.accountVisual}
        address={address}
        size={40}
      />
      <span className={styles.address}>{username || truncateAddress(address)}</span>
    </div>
  );
};

export default VoterRow;
