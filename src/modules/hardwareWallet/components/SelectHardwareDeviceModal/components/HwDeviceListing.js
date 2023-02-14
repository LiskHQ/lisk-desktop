import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectActiveHardwareDeviceId,
  selectHardwareDevices,
} from 'src/modules/hardwareWallet/store/hardwareWalletSelectors';
import HWManager from 'src/modules/hardwareWallet/manager/HWManager';
import Icon from '@theme/Icon';
import CheckBox from '@theme/CheckBox';
import styles from './HwDeviceListing.css';

function HwDeviceListing() {
  const hwDevices = useSelector(selectHardwareDevices);

  function onSelect(id) {
    HWManager.selectDevice(id);
  }

  return (
    <div className={styles.hwDeviceListing}>
      {hwDevices.map((hwDevice) => (
        <HwDeviceItem key={hwDevice.deviceId} hwDevice={hwDevice} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default HwDeviceListing;

function HwDeviceItem({ hwDevice, onSelect }) {
  const activeHardwareDeviceId = useSelector(selectActiveHardwareDeviceId);

  function onChange() {
    onSelect(hwDevice.deviceId);
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
