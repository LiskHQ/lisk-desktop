import React from 'react';
import DialogLink from '@theme/dialog/link';
import { useTranslation } from 'react-i18next';
import styles from './DeviceToast.css';

function DeviceToast({ closeToast, label, showSelectHWDeviceLink, showSelectHWAccountsLink }) {
  const { t } = useTranslation();

  return (
    <div className={styles.DeviceToast}>
      <span>{t(label)}</span>
      {showSelectHWDeviceLink && (
        <DialogLink className={styles.selectLinkLabel} component="selectHardwareDeviceModal">
          {t('Select device')}
        </DialogLink>
      )}
      {showSelectHWAccountsLink && (
        <DialogLink className={styles.selectLinkLabel} component="switchAccount">
          {t('Select account')}
        </DialogLink>
      )}
      <button className={styles.resetButtonStyles} type="button" onClick={closeToast}>
        <span className={styles.closeIcon} />
      </button>
    </div>
  );
}

export default DeviceToast;
