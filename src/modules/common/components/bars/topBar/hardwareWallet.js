import React from 'react';
import Tooltip from 'src/theme/Tooltip';
import { useTranslation } from 'react-i18next';
import Icon from 'src/theme/Icon';
import { DEVICE_STATUS } from '@libs/hwServer/constants';
import styles from './hardwareWallet.css';

const Status = ({ status }) => (
  <div className={`${styles.statusWrapper} ${styles[status]}`}>
    <b>{status}</b>
  </div>
);

const HardwareWallet = () => {
  const { t } = useTranslation();

  /** @TODO:
   * actual values should be replaced when the useHWStatus hook is integrated by issue #4768
   * Also this component should return null when there is no current device connected.
   */
  const status = DEVICE_STATUS.STAND_BY;
  const hwStatusInfo = [
    { label: 'Brand :', value: 'Ledger' },
    { label: 'Model :', value: 'Nano S' },
    { label: 'ID :', value: '23233' },
    { label: 'Status :', value: <Status status={status} /> },
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

export default HardwareWallet;
