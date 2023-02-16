import { renderHook, act } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { IPC_MESSAGES } from '@libs/hwServer/constants';
import {setHardwareWalletDevices, setCurrentDevice} from "@hardwareWallet/store/actions";
import useHwListener from './useHwListener';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

const mockDispatch = jest.fn();
useDispatch.mockReturnValue(mockDispatch);

describe('useIpc', () => {
  const callbacks = {};
  const ipc = {
    on: jest.fn((event, callback) => {
      callbacks[event] = callback;
    }),
  };

  beforeEach(() => {
    mockDispatch.mockClear();
    window.ipc = ipc;
  });

  afterEach(() => {
    delete window.ipc;
  });

  it('Should return undefined if no ipc on window', () => {
    const { result, rerender } = renderHook(() => useHwListener());
    act(() => {
      delete window.ipc;
    });
    rerender();

    expect(result.current).toBe(undefined);
  });

  it('Should dispatch setDeviceUpdated when ipc receives DEVICE_LIST_CHANGED', () => {
    expect(ipc.on).toHaveBeenCalled();
    const devices = [{ deviceId: '1' }];

    callbacks[DEVICE_LIST_CHANGED]({}, devices);
    expect(mockDispatch).toHaveBeenCalledWith(
      setHardwareWalletDevices(devices)
    );
  });

  it('Should dispatch setDeviceUpdated when ipc receives DEVICE_UPDATE', () => {
    expect(ipc.on).toHaveBeenCalled();
    const device = {deviceId: '1'};

    callbacks[DEVICE_UPDATE]({}, device);
    expect(mockDispatch).toHaveBeenCalledWith(
      setCurrentDevice(device)
    );
  });
});
