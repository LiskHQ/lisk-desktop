import React from 'react';
import { useSelector } from 'react-redux';
import { selectHardwareDevices } from 'src/modules/hardwareWallet/store/hardwareWalletSelectors';
import HwDeviceItem from 'src/modules/hardwareWallet/components/SelectHardwareDeviceModal/components/HwDeviceItem';

function HwDeviceListing({ className }) {
  const hwDevices = useSelector(selectHardwareDevices);

  return (
    <div className={className}>
      {hwDevices.map((hwDevice) => (
        <HwDeviceItem key={hwDevice.deviceId} hwDevice={hwDevice} />
      ))}
    </div>
  );
}

export default HwDeviceListing;
