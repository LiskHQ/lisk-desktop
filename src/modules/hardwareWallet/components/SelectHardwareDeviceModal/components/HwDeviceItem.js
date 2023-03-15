import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckBox from '@theme/CheckBox';
import Icon from '@theme/Icon';
import { selectCurrentHWDeviceId } from '@hardwareWallet/store/selectors/hwSelectors';
import { setCurrentDevice } from '@hardwareWallet/store/actions';
import styles from './HwDeviceItem.css';

function HwDeviceItem({ hwDevice }) {
  const activeHardwareDeviceId = useSelector(selectCurrentHWDeviceId);
  const dispatch = useDispatch();

  function onChange() {
    dispatch(setCurrentDevice(hwDevice));
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
