import React from 'react';
import { useSelector } from 'react-redux';
import { selectHardwareDevices } from '@hardwareWallet/store/selectors';
import HwDeviceItem from '@hardwareWallet/components/SelectHardwareDeviceModal/components/HwDeviceItem';

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
