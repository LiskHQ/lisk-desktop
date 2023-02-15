import React from 'react';
import { useSelector } from 'react-redux';
import CheckBox from '@theme/CheckBox';
import Icon from '@theme/Icon';
import { selectActiveHardwareDeviceId } from 'src/modules/hardwareWallet/store/hardwareWalletSelectors';
import HWManager from "src/modules/hardwareWallet/manager/HWManager";
import styles from './HwDeviceItem.css';

function HwDeviceItem({ hwDevice }) {
  const activeHardwareDeviceId = useSelector(selectActiveHardwareDeviceId);

  function onChange() {
    HWManager.selectDevice(hwDevice.deviceId);
  }

  return (
    <div key={hwDevice.deviceId} className={styles.hwDevice}>
      <Icon name="iconLedgerDevice" className={styles.hwWalletIcon} />
      <div className={styles.infoContainer}>
        <h5 className={styles.modelInfo}>{hwDevice.model}</h5>
        <span className={styles.deviceId}>{hwDevice.deviceId}</span>
      </div>
      <CheckBox
        className={styles.checkBox}
        checked={activeHardwareDeviceId === hwDevice.deviceId}
        onChange={onChange}
      />
    </div>
  );
}

export default HwDeviceItem;
