import React from 'react';
import AccountVisual from '../../toolbox/accountVisual';
import Box from '../../toolbox/box';
import Icon from '../../toolbox/icon';

import styles from './votingQueue.css';


const VoteListItem = ({
  t, address, username, oldAmount, newAmount,
}) => (
  <Box className={styles.voteItemContainer}>
    <div className={`${styles.infoColumn} ${styles.delegateInfoContainer}`}>
      <AccountVisual address={address} />
      <div className={styles.delegateInfo}>
        <span className={styles.delegateAddress}>{address}</span>
        <span className={styles.delegateUsername}>{username}</span>
      </div>
    </div>
    <span className={`${styles.oldAmountColumn}`}>{`${oldAmount} LSK`}</span>
    <span className={`${styles.newAmountColumn}`}>{`${newAmount} LSK`}</span>
    <div className={styles.editIconsContainer}>
      <Icon name="edit" className={styles.editIcon} />
      <Icon name="deleteIcon" className={styles.editIcon} />
    </div>
  </Box>
);

export default VoteListItem;
