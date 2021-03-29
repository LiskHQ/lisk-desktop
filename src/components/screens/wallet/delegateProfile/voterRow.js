import React from 'react';

import AccountVisual from '@toolbox/accountVisual';
import styles from './delegateProfile.css';

const VoterRow = props => (
  <div className={styles.voteItem} key={props.data}>
    <AccountVisual
      className={styles.accountVisual}
      address={props.data}
      size={40}
    />
    <span className={styles.address}>{props.data}</span>
  </div>
);

export default VoterRow;
