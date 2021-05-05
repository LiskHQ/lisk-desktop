import React from 'react';

import AccountVisual from '@toolbox/accountVisual';
import styles from './delegateProfile.css';

const VoterRow = ({ data = {} }) => {
  const { address, username } = data;
  return (
    <div className={styles.voteItem}>
      <AccountVisual
        className={styles.accountVisual}
        address={address}
        size={40}
      />
      <span className={styles.address}>{username || address}</span>
    </div>
  );
};

export default VoterRow;
