import { renderHook } from '@testing-library/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { IPC_MESSAGES } from '@libs/hwServer/constants';
import { mockHWCurrentDevice, mockHWAccounts } from '@hardwareWallet/__fixtures__';
import { setHardwareWalletDevices, setCurrentDevice } from '@hardwareWallet/store/actions';
import { getHWAccounts } from '../utils/getHWAccounts';
import useHwListener from './useHwListener';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

const mockDispatch = jest.fn();
useDispatch.mockReturnValue(mockDispatch);

const mockAppStore = {
  hardwareWallet: {
    currentDevice: mockHWCurrentDevice,
  },
};
useSelector.mockImplementation((callback) => callback(mockAppStore));

jest.mock('../utils/getHWAccounts');
getHWAccounts.mockResolvedValue(mockHWAccounts);

const callbacks = {};
const mockSubscribe = jest.fn((event, callback) => {
  callbacks[event] = callback;
});
jest.mock('@hardwareWallet/manager/HWManager', () => ({
  subscribe: (...arg) => mockSubscribe(...arg),
}));

describe('useHwListener', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('Should return undefined if no ipc on window', () => {
    const { result, rerender } = renderHook(() => useHwListener());
    rerender();

    expect(result.current).toBe(undefined);
  });

  it('Should dispatch setDeviceUpdated when ipc receives DEVICE_LIST_CHANGED', () => {
    renderHook(() => useHwListener());
    expect(mockSubscribe).toHaveBeenCalled();
    const devices = [{ deviceId: '1' }];
    callbacks[DEVICE_LIST_CHANGED]({}, devices);
    expect(mockDispatch).toHaveBeenCalledWith(setHardwareWalletDevices(devices));
  });

  it('Should dispatch setDeviceUpdated when ipc receives DEVICE_UPDATE', () => {
    renderHook(() => useHwListener());
    expect(mockSubscribe).toHaveBeenCalled();
    const device = { deviceId: '1' };

    callbacks[DEVICE_UPDATE]({}, device);
    expect(mockDispatch).toHaveBeenCalledWith(setCurrentDevice(device));
  });
});
