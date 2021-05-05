import React, { useState } from 'react';
import AccountVisual from '@toolbox/accountVisual';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import Icon from '@toolbox/icon';
import styles from './accountInfo.css';
import Identity from './identity';
import ActionBar from './actionBar';

const AccountInfo = ({
  address, t, activeToken, hwInfo, account, username, bookmark, isMultisignature, host,
}) => {
  const [showLegacy, setShowLegacy] = useState(false);
  const onClick = () => {
    if (activeToken === 'LSK' && account.summary.legacyAddress) {
      setShowLegacy(!showLegacy);
    }
  };

  return (
    <Box className={styles.wrapper}>
      <BoxContent className={`${styles.content} ${styles[activeToken]}`}>
        <h2 className={styles.title}>{t('Wallet address')}</h2>
        <div className={`${styles.info} ${showLegacy ? styles.showLegacy : ''}`}>
          <AccountVisual
            address={address}
            size={40}
          />
          {
            address ? (
              <Identity
                newAddress={address}
                legacyAddress={account.summary.legacyAddress}
                username={username}
                bookmark={bookmark}
                showLegacy={showLegacy}
                setShowLegacy={onClick}
              />
            ) : null
          }
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

export default AccountInfo;
