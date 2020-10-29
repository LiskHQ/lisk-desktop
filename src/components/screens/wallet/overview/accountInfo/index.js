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

const MultisigButton = ({ isMultisig, t }) => (
  <div className={styles.helperIcon}>
    <Tooltip
      className={`${styles.tooltipWrapper} ${styles.centerContent} ${isMultisig ? styles.whiteBackground : ''}`}
      position="bottom"
      size="maxContent"
      content={(
        <DialogLink component={isMultisig ? 'multisigAccountDetails' : 'multiSignature'}>
          <Icon name="multiSignature" className={styles.multisigIcon} />
        </DialogLink>
        )}
    >
      <p>{isMultisig ? t('View multisignature account details') : t('Register multisignature')}</p>
    </Tooltip>
  </div>
);

const BookmarkButton = ({
  delegate, address, bookmark, host, t,
}) => {
  if (host === address) return null;

  return (
    <div className={styles.helperIcon}>
      <Tooltip
        className={styles.tooltipWrapper}
        position="bottom"
        size="maxContent"
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
        <p>{t(bookmark === undefined ? 'Add to bookmarks' : 'Edit bookmark')}</p>
      </Tooltip>
    </div>
  );
};

const RequestButton = ({
  host, address, activeToken, t,
}) => {
  const props = {};
  if (host === address) {
    props.content = (
      <DialogLink component="request">
        <Icon name="qrCodeActive" className={styles.qrCodeIcon} />
      </DialogLink>
    );
    props.size = 'maxContent';
    props.children = (<p>{t(`Request ${activeToken}`)}</p>);
  } else {
    props.content = (<Icon name="qrCodeActive" className={styles.qrCodeIcon} />);
    props.size = 's';
    props.children = (<QRCode value={address} size={154} />);
  }

  return (
    <div className={`${styles.helperIcon} ${styles.qrCodeWrapper}`}>
      <Tooltip
        className={styles.tooltipWrapper}
        position="bottom"
        size={props.size}
        title={t('Scan address')}
        content={props.content}
      >
        {props.children}
      </Tooltip>
    </div>
  );
};

const AccountInfo = ({
  address, t, activeToken, hwInfo, delegate, bookmark, host, isMultisig,
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
        </div>
        <RequestButton
          host={host}
          address={address}
          activeToken={activeToken}
          t={t}
        />
        <BookmarkButton
          delegate={delegate}
          address={address}
          bookmark={bookmark}
          host={host}
          t={t}
        />
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
        <MultisigButton
          isMultisig={isMultisig}
          t={t}
        />
      </footer>
      <Icon
        name={activeToken === 'LSK' ? 'liskLogo' : 'bitcoinLogo'}
        className={styles.watermarkLogo}
      />
    </BoxContent>
  </Box>
);

export default AccountInfo;
