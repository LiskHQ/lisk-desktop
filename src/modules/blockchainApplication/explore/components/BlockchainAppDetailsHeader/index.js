import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Box from 'src/theme/box';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Skeleton from 'src/modules/common/components/skeleton/Skeleton';
import Icon from 'src/theme/Icon';
import walletConnectFallback from '@setup/react/assets/images/wallet-connect-fallback.svg';
import loadingBackgroundImage from '@setup/react/assets/images/loading-chain-background.png';
import loadingChainLogo from '@setup/react/assets/images/loading-chain-logo.png';
import styles from './blockchainAppDetailsHeader.css';

const BlockchainAppDetailsHeader = ({
  className,
  headerText,
  description,
  classNameDescription,
  application,
  chainAction,
  loading,
  clipboardCopyItems,
}) => {
  const { t } = useTranslation();
  const { name, projectPage, icon } = application.data;

  return (
    <header className={className}>
      {loading ? (
        <>
          <div className={styles.avatarContainer}>
            <img src={loadingChainLogo} className={styles.logo} />
            <img src={loadingBackgroundImage} className={styles.bg} />
          </div>
          <Box className={`${styles.detailsWrapper} ${styles.loadingDetailsWrapper}`}>
            <div className={styles.chainNameWrapper}>
              <Skeleton className={styles.skeleton} width="25%" />
            </div>
            <Box className={styles.addressRow}>
              <Skeleton className={styles.skeleton} width="50%" />
              <Skeleton className={styles.skeleton} width="25%" />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <div className={styles.avatarContainer}>
            {headerText && <h2 className={styles.headerText}>{headerText}</h2>}
            <div className={styles.logoContainer}>
              <img
                className={styles.logo}
                src={icon || walletConnectFallback}
                alt="logo"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = walletConnectFallback;
                }}
              />
            </div>
            <div className={styles.bg} />
          </div>
          <Box className={styles.detailsWrapper}>
            <div className={styles.chainNameWrapper}>
              <span className="chain-name-text">{name}</span>
              {chainAction}
            </div>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={projectPage}
              className={styles.appLink}
            >
              <Icon name="chainLinkIcon" className={styles.hwWalletIcon} />
              {t(projectPage)}
            </a>
            {clipboardCopyItems?.length > 0 && (
              <Box className={styles.clipboardCopyItems}>
                {clipboardCopyItems.map((clipboardCopyItem) => {
                  const { label, value } = clipboardCopyItem;

                  return (
                    <div className={styles.clipboardCopyItem} key={clipboardCopyItem.value}>
                      {label && <span className={styles.addressRowContentLabel}>{label}</span>}
                      <CopyToClipboard
                        text={value?.replace(/^(.{6})(.+)?(.{4})$/, '$1...$3')}
                        value={value}
                        className="tx-id"
                        containerProps={{
                          size: 'xs',
                          className: 'copy-address',
                        }}
                      />
                    </div>
                  );
                })}
              </Box>
            )}
            {description && (
              <p className={classNames(styles.description, classNameDescription)}>{description}</p>
            )}
          </Box>
        </>
      )}
    </header>
  );
};

export default BlockchainAppDetailsHeader;
