import React from 'react';
import QRCode from 'qrcode.react';
import AccountVisual from '../../../../toolbox/accountVisual';
import { PrimaryButton } from '../../../../toolbox/buttons/button';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import Icon from '../../../../toolbox/icon';
import BookmarkDropdown from '../../../bookmarks/bookmarkDropdown';
import DropdownButton from '../../../../toolbox/dropdownButton';
import CopyToClipboard from '../../../../toolbox/copyToClipboard';
import { getAddress } from '../../../../../utils/hwManager';
import styles from './accountInfo.css';
import Tooltip from '../../../../toolbox/tooltip/tooltip';

const BookmarkIcon = ({ isBookmark }) => (
  <Icon
    name={isBookmark ? 'bookmark' : 'bookmarkActive'}
    className={styles.bookmark}
  />
);

const AccountInfo = ({
  address, t, activeToken, hwInfo, delegate, isBookmark, publicKey,
}) => {
  const primaryValue = delegate && delegate.username ? delegate.username : address;
  const secondaryValue = delegate && delegate.username ? address : '';

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
            <span className={`${styles.primary} account-primary`}>{primaryValue}</span>
            {
              secondaryValue
                ? <span className={`${styles.secondary} delegate-secondary`}>{secondaryValue}</span>
                : null
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
            <DropdownButton
              buttonClassName="bookmark-account-button"
              className={`${styles.bookmarkDropdown} bookmark-account`}
              buttonLabel={<BookmarkIcon isBookmark={isBookmark} />}
              ButtonComponent={PrimaryButton}
              align="right"
            >
              <BookmarkDropdown
                token={activeToken}
                delegate={delegate}
                address={address}
                publicKey={publicKey}
                isBookmark={isBookmark}
                onSubmitClick={() => {}}
              />
            </DropdownButton>
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
