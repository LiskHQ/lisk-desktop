import React from 'react';
import QRCode from 'qrcode.react';
import AccountVisual from '../../../../toolbox/accountVisual';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import Icon from '../../../../toolbox/icon';
import CopyToClipboard from '../../../../toolbox/copyToClipboard';
import { getAddress } from '../../../../../utils/hwManager';
import { isEmpty } from '../../../../../utils/helpers';
import styles from './accountInfo.css';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import DialogLink from '../../../../toolbox/dialog/link';
import Identity from './identity';

const BookmarkIcon = ({ bookmark }) => (
  <Icon
    name={bookmark === undefined ? 'bookmark' : 'bookmarkActive'}
    className={styles.bookmark}
  />
);

/* eslint-disable complexity */
const AccountInfo = ({
  address, t, activeToken, hwInfo, delegate, bookmark, host,
}) => (
  <Box className={styles.wrapper}>
    <BoxContent className={`${styles.content} ${styles[activeToken]}`}>
      <h2 className={styles.title}>{t('Wallet address')}</h2>
      <div className={styles.info}>
        <AccountVisual
          address={address}
          size={40}
        />
        <Identity
          address={address}
          delegate={delegate}
          bookmark={bookmark}
        />
      </div>
      <footer>
        <div className={styles.helperIcon}>
          <Tooltip
            className={styles.tooltipWrapper}
            position="bottom"
            tooltipClassName={styles.tooltip}
            content={(
              <CopyToClipboard
                value={address}
                type="icon"
                copyClassName={styles.copyIcon}
                className={styles.copyIcon}
              />
            )}
          >
            <p>{t('Copy address')}</p>
          </Tooltip>
        </div>
        <div className={`${styles.helperIcon} ${styles.qrCodeWrapper}`}>
          {
          host === address ? (
            <Tooltip
              className={styles.tooltipWrapper}
              position="bottom"
              tooltipClassName={styles.tooltip}
              content={(
                <DialogLink component="request">
                  <Icon name="qrCodeActive" className={styles.qrCodeIcon} />
                </DialogLink>
              )}
            >
              <p>{t(`Request ${activeToken}`)}</p>
            </Tooltip>
          ) : (
            <Tooltip
              className={styles.tooltipWrapper}
              position="bottom"
              size="s"
              title={t('Scan address')}
              content={<Icon name="qrCodeActive" className={styles.qrCodeIcon} />}
            >
              <QRCode value={address} size={154} />
            </Tooltip>
          )}
        </div>
        {
          host !== address ? (
            <div className={styles.helperIcon}>
              <Tooltip
                className={styles.tooltipWrapper}
                position="bottom"
                tooltipClassName={styles.tooltip}
                content={(
                  <DialogLink
                    component="addBookmark"
                    data={delegate ? {
                      formAddress: address,
                      label: delegate.username,
                      isDelegate: true,
                    } : {
                      formAddress: address,
                      isDelegate: false,
                      label: bookmark ? bookmark.title : '',
                    }}
                  >
                    <BookmarkIcon bookmark={bookmark} />
                  </DialogLink>
                )}
              >
                <p>{t('Add to bookmarks')}</p>
              </Tooltip>
            </div>
          ) : null
        }
        {
          hwInfo && !isEmpty(hwInfo) && host === address && (
            <div
              className={`${styles.helperIcon} verify-address ${styles.tooltipWrapper}`}
              onClick={() => getAddress({
                deviceId: hwInfo.deviceId,
                index: hwInfo.derivationIndex,
                showOnDevice: true,
              })}
            >
              <Tooltip
                className={styles.verify}
                position="bottom"
                title={t('Verify address')}
                content={<Icon name="verifyWalletAddress" className={styles.qrCodeIcon} />}
              >
                <span>{t('Verify the address in your hardware wallet device.')}</span>
              </Tooltip>
            </div>
          )
        }
      </footer>
      <Icon
        name={activeToken === 'LSK' ? 'liskLogo' : 'bitcoinLogo'}
        className={styles.watermarkLogo}
      />
    </BoxContent>
  </Box>
);

export default AccountInfo;
