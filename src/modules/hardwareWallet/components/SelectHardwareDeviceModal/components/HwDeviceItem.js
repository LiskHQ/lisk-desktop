import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckBox from '@theme/CheckBox';
import Icon from '@theme/Icon';
import { selectCurrentHWDevicePath } from '@hardwareWallet/store/selectors/hwSelectors';
import { setCurrentHWDevice } from '@hardwareWallet/store/actions';
import styles from './HwDeviceItem.css';

function HwDeviceItem({ hwDevice }) {
  const { manufacturer, product, path } = hwDevice || {};

  const activeHardwareDeviceId = useSelector(selectCurrentHWDevicePath);
  const dispatch = useDispatch();

  function onChange() {
    dispatch(setCurrentHWDevice(hwDevice));
  }

  const usbPort = path
    ?.split('/')
    ?.find((segment) => segment.startsWith('usb'))
    ?.split('@')[0];

  return (
    <div className={styles.hwDevice}>
      <Icon name="iconLedgerDevice" className={styles.hwWalletIcon} />
      <div className={styles.infoContainer}>
        <h5 className={styles.modelInfo}>{`${manufacturer} ${product}`}</h5>
        <span className={styles.path}>{usbPort}</span>
      </div>
      <CheckBox
        className={styles.checkBox}
        checked={activeHardwareDeviceId === path}
        onChange={onChange}
      />
    </div>
  );
}

export default HwDeviceItem;
