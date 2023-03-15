import React from 'react';
import Tooltip from '@theme/Tooltip';
import { useTranslation } from 'react-i18next';
import Icon from '@theme/Icon';
import { useSelector } from 'react-redux';
import { selectCurrentHWDevice } from '@hardwareWallet/store/selectors/hwSelectors';
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

  const { manufacturer, product, status } = currentHWDevice;

  const hwStatusInfo = [
    { label: `${t('Brand')} : `, value: manufacturer },
    { label: `${t('Model')} : `, value: product },
    { label: `${t('Status')} : `, value: <Status status={status} /> },
  ];

  return (
    <section className={styles.wrapper}>
      <Tooltip
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
            <b>{t('Hardware wallet details')}</b>
          </h6>
          <ul>
            {hwStatusInfo.map(({ label, value }) => (
              <li key={label}>
                <div>{label}</div>
                <div>{value}</div>
              </li>
            ))}
          </ul>
        </div>
      </Tooltip>
    </section>
  );
};
