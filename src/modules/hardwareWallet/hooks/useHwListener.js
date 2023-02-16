import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { IPC_MESSAGES } from '@libs/hwServer/constants';
import {
  setHardwareWalletDevices,
  setCurrentDevice,
} from '@hardwareWallet/store/actions';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

function useHwListener() {
  const dispatch = useDispatch();

  const { ipc } = window;

  if (!ipc) return;

  useEffect(() => {
    ipc.on(DEVICE_LIST_CHANGED, (action, data) => {
      dispatch(setHardwareWalletDevices(data));
    });
    ipc.on(DEVICE_UPDATE, (action, data) => {
      dispatch(setCurrentDevice(data));
    });
  }, []);
}

export default useHwListener;
