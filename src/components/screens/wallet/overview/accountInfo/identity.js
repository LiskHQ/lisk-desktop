import React, { useState } from 'react';
import styles from './accountInfo.css';

/**
 *
 * Displays address and username
 * The address is initially truncated but
 * but toggles expanded on user click
 *
 */
const Identity = ({ address, delegate, bookmark }) => {
  if (!address) return null;
  const username = (delegate && delegate.username) || '';
  const truncatedAddress = address.length > 12
    ? `${address.slice(0, 10)}...${address.slice(-3)}` : address;

  const [modAddress, setModAddress] = useState(truncatedAddress);
  const onClick = () => setModAddress(modAddress === address ? truncatedAddress : address);

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
                {modAddress}
              </span>
            </>
          )
          : (
            <span
              className={`${styles.primary} ${styles.noSelect} account-primary`}
              onClick={onClick}
            >
              {modAddress}
            </span>
          )
      }
    </div>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (prevProps.address === nextProps.address);

export default React.memo(Identity, areEqual);
