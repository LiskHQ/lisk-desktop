import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckBox from '@theme/CheckBox';
import Icon from '@theme/Icon';
import { selectCurrentHWDevicePath } from '@hardwareWallet/store/selectors/hwSelectors';
import { setCurrentHWDevice } from '@hardwareWallet/store/actions';
import { getPubKey } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';
import { TertiaryButton } from '@theme/buttons';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './HwDeviceItem.css';

function HwDeviceItem({ hwDevice }) {
  const { t } = useTranslation();
  const { manufacturer, product, path } = hwDevice || {};

  const activeHardwareDeviceId = useSelector(selectCurrentHWDevicePath);
  const dispatch = useDispatch();

  function onChange() {
    dispatch(setCurrentHWDevice(hwDevice));
  }

  async function handleShowAddressOnDevice() {
    await getPubKey(hwDevice.path, undefined, true);
  }

  return (
    <div className={styles.hwDevice}>
      <Icon name="iconLedgerDevice" className={styles.hwWalletIcon} />
      <div className={styles.infoContainer}>
        <h5 className={styles.modelInfo}>{`${manufacturer} ${product}`}</h5>
        <TertiaryButton className={classNames(styles.btnShowPubkey)} onClick={handleShowAddressOnDevice}>
          {t('Ping device')}
        </TertiaryButton>
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
