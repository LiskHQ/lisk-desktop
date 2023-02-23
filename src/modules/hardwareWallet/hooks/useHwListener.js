import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { IPC_MESSAGES } from '@libs/hwServer/constants';
import {
  setHardwareWalletDevices,
  setCurrentDevice,
} from '@hardwareWallet/store/actions';
import HWManager from "@hardwareWallet/manager/HWManager";

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

function useHwListener() {
  console.log('HWManager', HWManager)
  const dispatch = useDispatch();
  const {on} = window?.ipc || {}
  useEffect(() => {
    HWManager.subscribe(DEVICE_LIST_CHANGED, (_, data) => {
      dispatch(setHardwareWalletDevices(data));
    });
    HWManager.subscribe(DEVICE_UPDATE, (_, data) => {
      dispatch(setCurrentDevice(data));
    });
  }, [dispatch, on]);
}

export default useHwListener;
