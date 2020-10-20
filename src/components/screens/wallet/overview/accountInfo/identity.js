import React, { useState } from 'react';

import styles from './accountInfo.css';
import { truncateAddress } from '../../../../../utils/account';

/**
 *
 * Displays address and username
 * The address is initially truncated but
 * but toggles expanded on user click
 *
 */
const Identity = ({
  address,
  account,
  isDelegate,
  bookmark,
}) => {
  if (!address) return null;
  const username = (isDelegate && account.username) || '';
  const truncatedAddress = address.length > 12
    ? truncateAddress(address) : address;

  const [isTruncated, setTruncationState] = useState(true);
  const onClick = () => setTruncationState(!isTruncated);

  return (
    <div className={styles.text}>
      {
        username || !!bookmark
          ? (
            <>
              <span className={`${styles.primary} account-primary`}>
                {username || bookmark.title}
              </span>
              <span
                className={`${styles.secondary} ${styles.noSelect} delegate-secondary`}
                onClick={onClick}
              >
                {isTruncated ? truncatedAddress : address}
              </span>
            </>
          )
          : (
            <span
              className={`${styles.primary} ${styles.noSelect} account-primary`}
              onClick={onClick}
            >
              {isTruncated ? truncatedAddress : address}
            </span>
          )
      }
    </div>
  );
};


export default Identity;
