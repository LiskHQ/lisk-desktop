import React from 'react';
import AccountVisual from '../../../toolbox/accountVisual';
import Box from '../../../toolbox/box';
import Icon from '../../../toolbox/icon';

import styles from './editor.css';


const VoteListItem = ({
  address, username, confirmed, unconfirmed,
}) => (
  <Box className={styles.voteItemContainer}>
    <div className={`${styles.infoColumn} ${styles.delegateInfoContainer}`}>
      <AccountVisual address={address} />
      <div className={styles.delegateInfo}>
        <span className={styles.delegateAddress}>{address}</span>
        <span className={styles.delegateUsername}>{username}</span>
      </div>
    </div>
    <span className={`${styles.oldAmountColumn}`}>{`${confirmed} LSK`}</span>
    <span className={`${styles.newAmountColumn}`}>{`${unconfirmed} LSK`}</span>
    <div className={styles.editIconsContainer}>
      <span onClick={console.log}>
        <Icon name="edit" className={styles.editIcon} />
      </span>
      <span onClick={console.log}>
        <Icon name="deleteIcon" className={styles.editIcon} />
      </span>
    </div>
  </Box>
);

export default VoteListItem;
