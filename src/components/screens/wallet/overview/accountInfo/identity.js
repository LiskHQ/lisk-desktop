import React from 'react';

import { truncateAddress } from '@utils/account';
import Tooltip from '@toolbox/tooltip/tooltip';
import CopyToClipboard from '@toolbox/copyToClipboard';
import styles from './accountInfo.css';

const Legacy = ({ legacyAddress }) => (
  <div className={styles.legacy}>
    <span className={`${styles.text} ${styles.label}`}>Old address</span>
    <CopyToClipboard
      text={legacyAddress}
      className={styles.text}
    >
      {legacyAddress}
    </CopyToClipboard>
  </div>
);

const WithTitle = ({
  newAddress,
  legacyAddress,
  bookmark,
  username = '',
  t = str => str,
  onClickFn,
}) => (
  <div className={styles.identity}>
    <span className={`${styles.primary} ${styles.text} ${styles.noSelect} account-primary`}>
      {username || bookmark.title}
    </span>
    <Tooltip
      className={`${styles.tooltip} ${styles.secondary} ${styles.truncated}`}
      title={t('Click to see full and old addresses')}
      content={(
        <span
          className={`${styles.text} ${styles.noSelect} account-secondary-truncated`}
          onClick={onClickFn}
        >
          {truncateAddress(newAddress)}
        </span>
      )}
    />
    <Tooltip
      className={`${styles.tooltip} ${styles.secondaryTooltip} ${styles.full}`}
      title={t('Click to hide full and old addresses')}
      content={(
        <span
          className={`${styles.text} ${styles.noSelect} account-secondary-full`}
          onClick={onClickFn}
        >
          {newAddress}
        </span>
      )}
    />
    <Legacy legacyAddress={legacyAddress} />
  </div>
);

const WithOutTitle = ({
  newAddress,
  legacyAddress,
  t = str => str,
  onClickFn,
}) => (
  <div className={styles.identity}>
    <Tooltip
      className={`${styles.tooltip} ${styles.primary} ${styles.truncated}`}
      title={t('Click to see full and old addresses')}
      content={(
        <span
          className={`${styles.text} ${styles.primary} ${styles.noSelect} account-primary-truncated`}
          onClick={onClickFn}
        >
          {truncateAddress(newAddress)}
        </span>
      )}
    />
    <Tooltip
      className={`${styles.tooltip} ${styles.primaryTooltip} ${styles.full}`}
      title={t('Click to hide full and old addresses')}
      content={(
        <span
          className={`${styles.text} ${styles.primary} ${styles.noSelect} delegate-primary-full`}
          onClick={onClickFn}
        >
          {newAddress}
        </span>
      )}
    />
    <Legacy legacyAddress={legacyAddress} />
  </div>
);

/**
 *
 * Displays address and username
 * The address is initially truncated but
 * but toggles expanded on user click
 *
 */
const Identity = (props) => {
  if (!props.newAddress) {
    return null;
  }
  if (props.username || !!props.bookmark) {
    return <WithTitle {...props} />;
  }
  return <WithOutTitle {...props} />;
};

export default Identity;
