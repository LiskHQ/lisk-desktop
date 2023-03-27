import React from 'react';

import { truncateAddress } from '@wallet/utils/account';
import Tooltip from 'src/theme/Tooltip';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import styles from './walletInfo.css';

const Legacy = ({ legacyAddress }) => (
  <div className={styles.legacy}>
    <span className={`${styles.text} ${styles.label}`}>Old address</span>
    <CopyToClipboard text={legacyAddress} className={styles.text}>
      {legacyAddress}
    </CopyToClipboard>
  </div>
);

/**
 *
 * Displays address and username
 * The address is initially truncated but
 * but toggles expanded on user click
 *
 */
const Identity = ({
  newAddress,
  legacyAddress,
  bookmark,
  username = '',
  t = (str) => str,
  setShowLegacy,
}) => {
  const hasTitle = username || !!bookmark;
  let classNames = {
    tooltipTruncated: `${styles.tooltip} ${styles.primary} ${styles.truncated}`,
    tooltipFull: `${styles.tooltip} ${styles.primaryTooltip} ${styles.full}`,
    spanTruncated: `${styles.text} ${styles.primary} ${styles.noSelect} account-primary`,
    spanFull: `${styles.text} ${styles.primary} ${styles.noSelect} validator-primary-full`,
  };

  if (hasTitle) {
    classNames = {
      tooltipTruncated: `${styles.tooltip} ${styles.secondary} ${styles.truncated}`,
      tooltipFull: `${styles.tooltip} ${styles.secondaryTooltip} ${styles.full}`,
      spanTruncated: `${styles.text} ${styles.noSelect} account-secondary-truncated`,
      spanFull: `${styles.text} ${styles.noSelect} account-secondary-full`,
    };
  }

  return (
    <div className={styles.identity}>
      {hasTitle ? (
        <span className={`${styles.primary} ${styles.text} ${styles.noSelect} account-primary`}>
          {username || bookmark.title}
        </span>
      ) : null}
      <Tooltip
        className={classNames.tooltipTruncated}
        content={
          <span className={classNames.spanTruncated} onClick={setShowLegacy}>
            {truncateAddress(newAddress)}
          </span>
        }
      >
        <span>
          {legacyAddress
            ? t('Click to see full and old addresses')
            : t('Click to see the full address')}
        </span>
      </Tooltip>
      <Tooltip
        className={classNames.tooltipFull}
        content={
          <span className={classNames.spanFull} onClick={setShowLegacy}>
            {newAddress}
          </span>
        }
      >
        <span>
          {legacyAddress
            ? t('Click to hide full and old addresses')
            : t('Click to hide the full address')}
        </span>
      </Tooltip>
      {legacyAddress ? <Legacy legacyAddress={legacyAddress} /> : null}
    </div>
  );
};

export default Identity;
