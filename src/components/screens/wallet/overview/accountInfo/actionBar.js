import React from 'react';
import QRCode from 'qrcode.react';
import { tokenMap } from '@constants';
import { getAddress } from '@utils/hwManager';
import { isEmpty } from '@utils/helpers';
import Icon from '@toolbox/icon';
import CopyToClipboard from '@toolbox/copyToClipboard';
import Tooltip from '@toolbox/tooltip/tooltip';
import DialogLink from '@toolbox/dialog/link';
import styles from './accountInfo.css';

const BookmarkIcon = ({ bookmark }) => (
  <Icon
    name={bookmark === undefined ? 'bookmark' : 'bookmarkActive'}
    className={styles.bookmark}
  />
);

// eslint-disable-next-line complexity
const ActionBar = ({
  address, host, activeToken, username, account, bookmark, hwInfo, isMultisignature, t,
}) => (
  <footer>
    <div className={styles.helperIcon}>
      <Tooltip
        className={styles.tooltipWrapper}
        position="bottom"
        size="maxContent"
        content={(
          <CopyToClipboard
            value={activeToken === tokenMap.BTC.key
              ? address : `Address: ${address} - Public key: ${account.summary.publicKey}`}
            type="icon"
            copyClassName={styles.copyIcon}
            className={styles.copyIcon}
          />
        )}
      >
        <p>{activeToken === tokenMap.BTC.key ? t('Copy address') : t('Copy address and public key')}</p>
      </Tooltip>
    </div>
    <div className={`${styles.helperIcon} ${styles.qrCodeWrapper}`}>
      {
        host === address ? (
          <Tooltip
            className={styles.tooltipWrapper}
            position="bottom"
            size="maxContent"
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
        )
      }
    </div>
    {
      host !== address ? (
        <div className={styles.helperIcon}>
          <Tooltip
            className={`${styles.tooltipWrapper} add-bookmark-icon`}
            position="bottom"
            size="maxContent"
            content={(
              <DialogLink
                component="addBookmark"
                data={username ? {
                  formAddress: address,
                  label: account.dpos?.delegate?.username,
                  isDelegate: account.summary?.isDelegate,
                } : {
                  formAddress: address,
                  label: bookmark ? bookmark.title : '',
                  isDelegate: account.summary?.isDelegate,
                }}
              >
                <BookmarkIcon bookmark={bookmark} />
              </DialogLink>
            )}
          >
            <p>{t(bookmark === undefined ? 'Add to bookmarks' : 'Edit bookmark')}</p>
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
            className={styles.tooltipWrapper}
            position="bottom"
            title={t('Verify address')}
            content={<Icon name="verifyWalletAddress" className={styles.hwWalletIcon} />}
          >
            <span>{t('Verify the address in your hardware wallet device.')}</span>
          </Tooltip>
        </div>
      )
    }
    {address === host && (
      <div className={styles.helperIcon}>
        <Tooltip
          className={`${styles.tooltipWrapper} ${styles.centerContent} ${isMultisignature ? styles.whiteBackground : ''}`}
          position="bottom"
          size="maxContent"
          content={(
            <DialogLink component={isMultisignature ? 'multisigAccountDetails' : 'multiSignature'}>
              <Icon name="multiSignatureOutline" className={styles.multisigIcon} />
            </DialogLink>
          )}
        >
          <p>{isMultisignature ? t('View multisignature account details') : t('Register multisignature')}</p>
        </Tooltip>
      </div>
    )}
  </footer>
);

export default ActionBar;
