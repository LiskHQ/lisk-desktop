import React, { useState } from 'react';
import AccountVisual from '@wallet/detail/info/accountVisual';
import Box from '@basics/box';
import BoxContent from '@basics/box/content';
import Icon from '@basics/icon';
import styles from './accountInfo.css';
import Identity from './identity';
import ActionBar from './actionBar';

const AccountInfo = ({
  address, t, activeToken, hwInfo, account, username, bookmark, isMultisignature, host,
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const onClick = () => setShowFullAddress(!showFullAddress);

  return (
    <Box className={styles.wrapper}>
      <BoxContent className={`${styles.content} ${styles[activeToken]}`}>
        <h2 className={styles.title}>{t('Wallet address')}</h2>
        <div className={`${styles.info} ${showFullAddress ? styles.showFullAddress : ''}`}>
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
                showLegacy={showFullAddress}
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
