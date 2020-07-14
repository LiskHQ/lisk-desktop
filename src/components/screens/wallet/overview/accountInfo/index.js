import React, { useMemo } from 'react';
import QRCode from 'qrcode.react';
import AccountVisual from '../../../../toolbox/accountVisual';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import Icon from '../../../../toolbox/icon';
import CopyToClipboard from '../../../../toolbox/copyToClipboard';
import { getAddress } from '../../../../../utils/hwManager';
import styles from './accountInfo.css';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import DialogLink from '../../../../toolbox/dialog/link';

const BookmarkIcon = ({ isBookmark }) => (
  <Icon
    name={isBookmark ? 'bookmarkActive' : 'bookmark'}
    className={styles.bookmark}
  />
);

/* eslint-disable complexity */
const AccountInfo = ({
  address, t, activeToken, hwInfo, delegate, isBookmark,
}) => {
  const truncatedAddress = useMemo(
    () =>
      `${address.slice(0, 10)}...${address.slice(-3)}`,
    [address],
  );
  const primaryValue = delegate && delegate.username ? delegate.username : truncatedAddress;
  const secondaryValue = delegate && delegate.username ? truncatedAddress : '';
  const primaryValueTypeShown = delegate && delegate.username ? 'username' : 'address';

  return (
    <Box className={styles.wrapper}>
      <BoxContent className={`${styles.content} ${styles[activeToken]}`}>
        <h2 className={styles.title}>{t('Wallet address')}</h2>
        <div className={styles.info}>
          <AccountVisual
            address={address}
            size={40}
          />
          <div className={styles.text}>
            <Tooltip
              tooltipClassName={styles.addressWrapper}
              className={`${styles.address} showOnRight`}
              content={<span className={`${styles.primary} account-primary`}>{primaryValue}</span>}
            >
              <span className={`${styles.primary} ${styles.addressTooltip}`}>{address}</span>
            </Tooltip>

            {
              secondaryValue
                && (
                <>
                  {
                    primaryValueTypeShown === 'address' ? (
                      <Tooltip
                        tooltipClassName={styles.addressWrapper}
                        className={`${styles.address} showOnRight`}
                        content={<span className={`${styles.secondary} delegate-secondary`}>{secondaryValue}</span>}
                      >
                        <span className={`${styles.primary} ${styles.addressTooltip}`}>{address}</span>
                      </Tooltip>
                    )
                      : <span className={`${styles.secondary} delegate-secondary`}>{secondaryValue}</span>
                  }
                </>
                )
            }
          </div>
        </div>
        <footer>
          <div className={styles.helperIcon}>
            <CopyToClipboard
              value={address}
              type="icon"
              copyClassName={styles.copyIcon}
              className={styles.copyIcon}
            />
          </div>
          <div className={styles.helperIcon}>
            <Tooltip
              tooltipClassName={styles.qrCodeWrapper}
              className={`${styles.qrCode} showOnBottom`}
              title={t('Scan address')}
              content={<Icon name="qrCodeActive" className={styles.qrCodeIcon} />}
            >
              <QRCode value={address} size={154} />
            </Tooltip>
          </div>
          <div className={styles.helperIcon}>
            <DialogLink component="bookmarks">
              <BookmarkIcon isBookmark={isBookmark} />
            </DialogLink>
          </div>
          {
            hwInfo
              ? (
                <div
                  className={`${styles.helperIcon} verify-address`}
                  onClick={() => getAddress({
                    deviceId: hwInfo.deviceId,
                    index: hwInfo.derivationIndex,
                    showOnDevice: true,
                  })}
                >
                  <Tooltip
                    className={`${styles.verify} showOnBottom`}
                    title={t('Verify address')}
                    content={<Icon name="verifyWalletAddressActive" className={styles.qrCodeIcon} />}
                  >
                    <span>{t('Verify the address in your hardware wallet device.')}</span>
                  </Tooltip>
                </div>
              )
              : null
          }
        </footer>
        <Icon
          name={activeToken === 'LSK' ? 'liskLogo' : 'bitcoinLogo'}
          className={styles.watermarkLogo}
        />
      </BoxContent>
    </Box>
  );
};

export default AccountInfo;
