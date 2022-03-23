import React from 'react';
import AccountVisual from '@basics/accountVisual';
import styles from './avatarWithNameAndAddress.css';

const AvatarWithNameAndAddress = ({ username, account: { address } }) => (
  <div className={styles.wrapper}>
    <AccountVisual size={36} address={address} />
    <span>
      <div className={styles.username}>{username}</div>
      <div className={styles.address}>{address}</div>
    </span>
  </div>
);

export default AvatarWithNameAndAddress;
