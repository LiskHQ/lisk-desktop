import React, { useState } from 'react';

import { truncateAddress } from 'utils/account';
import styles from './accountInfo.css';

/**
 *
 * Displays address and username
 * The address is initially truncated but
 * but toggles expanded on user click
 *
 */
const Identity = ({
  address,
  bookmark,
  username = '',
}) => {
  if (!address) return null;
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
