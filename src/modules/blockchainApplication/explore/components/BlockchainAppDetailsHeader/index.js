import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Skeleton from 'src/modules/common/components/skeleton/Skeleton';
import Icon from 'src/theme/Icon';
import loadingBackgroundImage from '../../../../../../setup/react/assets/images/loading-chain-background.png';
import loadingChainLogo from '../../../../../../setup/react/assets/images/loading-chain-logo.png';
import styles from './blockchainAppDetailsHeader.css';

const BlockchainAppDetailsHeader = ({ application, chainAction, loading, clipboardCopyItems }) => {
  const { t } = useTranslation();
  const { name, projectPage, icon, bg } = application.data;

  return (
    <header>
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
            <img src={icon} className={styles.logo} />
            <img src={bg} className={styles.bg} />
          </div>
          <Box className={styles.detailsWrapper}>
            <div className={styles.chainNameWrapper}>
              <span className="chain-name-text">{name}</span>
              {chainAction}
            </div>
            {clipboardCopyItems?.length > 0 && (
              <Box className={styles.addressRow}>
                {clipboardCopyItems.map((clipboardCopyItem) => {
                  const { label, value } = clipboardCopyItem;

                  return (
                    <div className={styles.addressRowContent} key={clipboardCopyItem.value}>
                      {label && <span className={styles.addressRowContentLabel}>{label}</span>}
                      <CopyToClipboard
                        text={value}
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
            <div className={styles.addressRow}>
              <a
                rel="noopener noreferrer"
                className={`${styles.appLink}`}
                target="_blank"
                href={projectPage}
              >
                <Icon name="chainLinkIcon" className={styles.hwWalletIcon} />
                {t(projectPage)}
              </a>
            </div>
          </Box>
        </>
      )}
    </header>
  );
};

export default BlockchainAppDetailsHeader;
