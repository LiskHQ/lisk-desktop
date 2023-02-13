import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { IPC_MESSAGES } from '@libs/hwServer/constants';
import {
  setDeviceListChanged,
  setDeviceUpdated,
} from 'src/modules/hardwareWallet/store/hardwareWalletActions';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

function useHwListener() {
  const dispatch = useDispatch();

  const { ipc } = window;

  if (!ipc) return;

  useEffect(() => {
    ipc.on(DEVICE_LIST_CHANGED, (action, data) => {
      dispatch(setDeviceListChanged(data));
    });
    ipc.on(DEVICE_UPDATE, (action, data) => {
      dispatch(setDeviceUpdated(data));
    });
  }, []);
}

export default useHwListener;
