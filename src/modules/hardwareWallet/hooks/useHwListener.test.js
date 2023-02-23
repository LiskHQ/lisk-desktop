import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { IPC_MESSAGES } from '@libs/hwServer/constants';
import {setHardwareWalletDevices, setCurrentDevice} from "@hardwareWallet/store/actions";
import useHwListener from './useHwListener';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

const mockDispatch = jest.fn();
useDispatch.mockReturnValue(mockDispatch);

const callbacks = {};
const mockSubscribe = jest.fn((event, callback) => {
    callbacks[event] = callback;
  })
jest.mock('@hardwareWallet/manager/HWManager', () => ({
  subscribe: mockSubscribe
}));

describe('useIpc', () => {

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('Should return undefined if no ipc on window', () => {
    const { result, rerender } = renderHook(() => useHwListener());
    rerender();

    expect(result.current).toBe(undefined);
  });

  it('Should dispatch setDeviceUpdated when ipc receives DEVICE_LIST_CHANGED', () => {
    expect(mockSubscribe).toHaveBeenCalled();
    const devices = [{ deviceId: '1' }];
    callbacks[DEVICE_LIST_CHANGED]({}, devices);
    expect(mockDispatch).toHaveBeenCalledWith(
      setHardwareWalletDevices(devices)
    );
  });

  it('Should dispatch setDeviceUpdated when ipc receives DEVICE_UPDATE', () => {
    expect(mockSubscribe).toHaveBeenCalled();
    const device = {deviceId: '1'};

    callbacks[DEVICE_UPDATE]({}, device);
    expect(mockDispatch).toHaveBeenCalledWith(
      setCurrentDevice(device)
    );
  });
});
