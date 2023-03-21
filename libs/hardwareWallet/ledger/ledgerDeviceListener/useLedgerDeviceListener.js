import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  addHWDevice,
  removeHWDevice,
  setCurrentHWDevice,
  setHWDevices,
} from '@hardwareWallet/store/actions';
import { subscribeToLedgerDeviceEvents } from '@libs/hardwareWallet/ledger/ledgerDeviceListener/subscribeToLedgerDevices';
import { selectHardwareDevices } from '@hardwareWallet/store/selectors/hwSelectors';
import { getConnectedHWDevices } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';
import { usePrevious } from 'src/utils/usePrevious';
import DeviceToast from '@hardwareWallet/components/DeviceToast/DeviceToast';

export function useLedgerDeviceListener() {
  const dispatch = useDispatch();
  const hwDevices = useSelector(selectHardwareDevices);
  const prevHWDevices = usePrevious(hwDevices);
  const [hasCheckedHWDevices, setHasCheckedHWDevices] = useState(false);
  const { ipc } = window;

  useEffect(() => {
    if (ipc && dispatch && !hasCheckedHWDevices) {
      // Necessary for keeping HW state on electron start and during window reload
      (async () => {
        try {
          const connectedDevices = await getConnectedHWDevices();
          if (connectedDevices?.length > 0) {
            dispatch(setHWDevices(connectedDevices));
            dispatch(setCurrentHWDevice(connectedDevices[0]));
          }
        } finally {
          setHasCheckedHWDevices(true);
        }
      })();
    }
  }, [ipc, dispatch, hasCheckedHWDevices]);

  useEffect(() => {
    if (hasCheckedHWDevices) {
      // Update Devices on NODE HID events
      subscribeToLedgerDeviceEvents((data) => {
        const { type, device } = data;
        if (type === 'remove') {
          dispatch(removeHWDevice(device));
        }
        if (type === 'add') {
          dispatch(addHWDevice(device));
        }
      });
    }
  }, [hasCheckedHWDevices]);

  useEffect(() => {
    if (hwDevices?.length || prevHWDevices?.length) {
      const isDeviceAdded = prevHWDevices?.length < hwDevices?.length;

      if (isDeviceAdded) {
        const addedDevice = [...hwDevices].pop();
        const label = `${addedDevice.manufacturer} ${addedDevice.product} connected. `;

        toast.info(
          <DeviceToast
            label={label}
            showSelectHWAccountsLink={hwDevices.length === 1}
            showSelectHWDeviceLink={hwDevices.length > 1}
          />
        );
      } else {
        const removedDevice = [...prevHWDevices].pop();
        const label = `${removedDevice.manufacturer} ${removedDevice.product} removed.`;

        toast.info(<DeviceToast label={label} />);
      }
    }
  }, [hwDevices.length]);
}
