import React from 'react';
import QRCode from 'qrcode.react';
import { getAddress } from '@wallet/utils/hwManager';
import { isEmpty } from 'src/utils/helpers';
import Icon from 'src/theme/Icon';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Tooltip from 'src/theme/Tooltip';
import DialogLink from 'src/theme/dialog/link';
import styles from './walletInfo.css';

const BookmarkIcon = ({ bookmark }) => (
  <Icon
    name={bookmark === undefined ? 'bookmark' : 'bookmarkActive'}
    className={styles.bookmark}
  />
);

const getMultiSignatureComponent = (
  isLoggedInAccount,
  isMultisignature,
) => {
  if (!isLoggedInAccount && !isMultisignature) {
    return null;
  }
  if (isMultisignature) {
    return 'multisigAccountDetails';
  }
  return 'multiSignature';
};

const MultiSignatureButton = ({ t, component, isMultisignature }) => (
  <DialogLink className={styles.helperIcon} component={component}>
    <Tooltip
      className={`${styles.tooltipWrapper} ${styles.centerContent} ${
        isMultisignature ? styles.whiteBackground : ''
      } account-info-msign`}
      position="bottom"
      size="maxContent"
      content={(
        <Icon
          name={
            isMultisignature
              ? 'registerMultisignature'
              : 'multiSignatureOutline'
          }
          className={styles.multisigIcon}
        />
      )}
    >
      <p>
        {isMultisignature
          ? t('View multisignature account details')
          : t('Register multisignature account')}
      </p>
    </Tooltip>
  </DialogLink>
);

const CopyAddressAndPublicKey = ({
  address, publicKey, t,
}) => {
  if (!publicKey) {
    return (
      <Tooltip
        className={styles.tooltipWrapper}
        position="bottom"
        size="maxContent"
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
    );
  }
  return (
    <Tooltip
      className={`${styles.tooltipWrapper} ${styles.noPadding}`}
      position="bottom"
      size="maxContent"
      content={
        <Icon name="copy" className={`${styles.qrCodeIcon} ${styles.white}`} />
      }
    >
      <div className={styles.copyButtonWrapper}>
        <div className={styles.row}>
          <span>{t('Copy address')}</span>
          <CopyToClipboard
            value={address}
            copyClassName={styles.copyIcon}
            className={styles.copyIcon}
            type="icon"
          />
        </div>
        <div className={styles.row}>
          <span>{t('Copy public key')}</span>
          <CopyToClipboard
            value={publicKey}
            copyClassName={styles.copyIcon}
            className={styles.copyIcon}
            type="icon"
          />
        </div>
      </div>
    </Tooltip>
  );
};

// eslint-disable-next-line complexity
const ActionBar = ({
  address,
  host,
  activeToken,
  username,
  account,
  bookmark,
  hwInfo,
  isMultisignature,
  t,
}) => {
  const isLoggedInAccount = address === host;
  const component = getMultiSignatureComponent(
    isLoggedInAccount,
    isMultisignature,
  );

  return (
    <footer>
      <div className={styles.helperIcon}>
        <CopyAddressAndPublicKey
          address={address}
          publicKey={account.summary.publicKey}
          t={t}
        />
      </div>
      <div className={`${styles.helperIcon} ${styles.qrCodeWrapper}`}>
        {host === address ? (
          <Tooltip
            className={styles.tooltipWrapper}
            position="bottom"
            size="maxContent"
            content={(
              <DialogLink component="request">
                <Icon name="qrCodeActive" className={`${styles.qrCodeIcon} request-token-button`} />
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
      {host !== address ? (
        <div className={styles.helperIcon}>
          <Tooltip
            className={`${styles.tooltipWrapper} add-bookmark-icon`}
            position="bottom"
            size="maxContent"
            content={(
              <DialogLink
                component="addBookmark"
                data={
                  username
                    ? {
                      formAddress: address,
                      label: account.pos?.validator?.username,
                      isValidator: account.summary.isValidator,
                    }
                    : {
                      formAddress: address,
                      label: bookmark ? bookmark.title : '',
                      isValidator: account.summary.isValidator,
                    }
                }
              >
                <BookmarkIcon bookmark={bookmark} />
              </DialogLink>
            )}
          >
            <p>
              {t(bookmark === undefined ? 'Add to bookmarks' : 'Edit bookmark')}
            </p>
          </Tooltip>
        </div>
      ) : null}
      {hwInfo && !isEmpty(hwInfo) && host === address && (
        <div
          className={`${styles.helperIcon} verify-address ${styles.tooltipWrapper}`}
          onClick={() =>
            getAddress({
              deviceId: hwInfo.deviceId,
              index: hwInfo.derivationIndex,
              showOnDevice: true,
            })}
        >
          <Tooltip
            className={styles.tooltipWrapper}
            position="bottom"
            title={t('Verify address')}
            content={(
              <Icon
                name="verifyWalletAddress"
                className={styles.hwWalletIcon}
              />
            )}
          >
            <span>
              {t('Verify the address in your hardware wallet device.')}
            </span>
          </Tooltip>
        </div>
      )}
      {component && (
        <MultiSignatureButton
          t={t}
          component={component}
          isMultisignature={isMultisignature}
        />
      )}
    </footer>
  );
};

export default ActionBar;
