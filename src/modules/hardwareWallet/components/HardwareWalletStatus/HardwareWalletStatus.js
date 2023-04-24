import React from 'react';
import Tooltip from '@theme/Tooltip';
import { useTranslation } from 'react-i18next';
import Icon from '@theme/Icon';
import { useSelector } from 'react-redux';
import { selectCurrentHWDevice } from '@hardwareWallet/store/selectors/hwSelectors';
import DialogLink from '@theme/dialog/link';
import styles from './HardwareWalletStatus.css';

const Status = ({ status }) => (
  <div className={`${styles.statusWrapper} ${styles[status]}`}>
    <b>{status}</b>
  </div>
);

export const HardwareWalletStatus = () => {
  const { t } = useTranslation();
  const currentHWDevice = useSelector(selectCurrentHWDevice);
  if (!currentHWDevice?.path) {
    return null;
  }

  const { manufacturer, product, isAppOpen, path } = currentHWDevice;
  const status = isAppOpen ? 'connected' : 'standby';
  const usbPort = path
    ?.split('/')
    ?.find((segment) => segment.startsWith('usb'))
    ?.split('@')[0];

  const hwStatusInfo = [
    { label: `${t('Brand')} : `, value: manufacturer },
    { label: `${t('Model')} : `, value: product },
    { label: `${t('USB ID')} : `, value: usbPort },
    { label: `${t('Status')} : `, value: <Status status={status} /> },
  ];

  return (
    <section className={styles.wrapper}>
      <Tooltip
        showTooltip
        tooltipClassName={`${styles.hwStatusTooltip}`}
        position="bottom left"
        content={
          <div className={`${styles.hwIcon} ${styles[status]}`}>
            <Icon name="hardwareWalletIcon" />
          </div>
        }
      >
        <div className={styles.dropdown}>
          <h6>
            <b>{t('Hardware wallet')}</b>
          </h6>
          <ul>
            {hwStatusInfo.map(({ label, value }) => (
              <li key={label}>
                <div>{label}</div>
                <div>{value}</div>
              </li>
            ))}
          </ul>
          <DialogLink className={styles.selectLinkLabel} component="switchAccount">
            {t('Switch account')}
          </DialogLink>
          <DialogLink className={styles.selectLinkLabel} component="selectHardwareDeviceModal">
            {t('Switch device')}
          </DialogLink>
        </div>
      </Tooltip>
    </section>
  );
};
