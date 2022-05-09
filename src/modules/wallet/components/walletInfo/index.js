import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Icon from 'src/theme/Icon';
import styles from './walletInfo.css';
import WalletVisual from '../walletVisual';
import Identity from './identity';
import ActionBar from './actionBar';

const WalletInfo = ({
  address,
  activeToken,
  hwInfo,
  account,
  username,
  bookmark,
  isMultisignature,
  host,
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const onClick = () => setShowFullAddress(!showFullAddress);
  const { t } = useTranslation();

  return (
    <Box className={styles.wrapper}>
      <BoxContent className={`${styles.content} ${styles.token}`}>
        <h2 className={styles.title}>{t('Wallet address')}</h2>
        <div
          className={`${styles.info} ${
            showFullAddress ? styles.showFullAddress : ''
          }`}
        >
          <WalletVisual address={address} size={40} />
          {address ? (
            <Identity
              newAddress={address}
              legacyAddress={account.summary.legacyAddress}
              username={username}
              bookmark={bookmark}
              showLegacy={showFullAddress}
              setShowLegacy={onClick}
            />
          ) : null}
        </div>
        <Icon
          name={activeToken === 'LSK' ? 'liskLogo' : 'bitcoinLogo'}
          className={styles.watermarkLogo}
        />
        <ActionBar
          address={address}
          host={host}
          activeToken={activeToken}
          username={username}
          account={account}
          bookmark={bookmark}
          hwInfo={hwInfo}
          isMultisignature={isMultisignature}
          t={t}
        />
      </BoxContent>
    </Box>
  );
};

export default WalletInfo;
