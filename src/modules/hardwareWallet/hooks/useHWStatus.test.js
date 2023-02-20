import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import useHWStatus from './useHWStatus';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('useHWStatus hook', () => {
  it('returns the device details', () => {
    const mockAppState = {
      hardwareWallet: {
        currentDevice: {
          deviceId: 23560,
          model: 'Nano S Plus',
          brand: 'Ledger',
          status: 'connected',
        },
      },
    };
    useSelector.mockImplementation((callback) => callback(mockAppState));
    const { result } = renderHook(() => useHWStatus());

    expect(result.current).toEqual(mockAppState.hardwareWallet.currentDevice);
  });

  it('returns default device details', () => {
    const mockAppState = {
      hardwareWallet: {
        currentDevice: {},
      },
    };
    useSelector.mockImplementation((callback) => callback(mockAppState));
    const { result } = renderHook(() => useHWStatus());

    expect(result.current).toEqual({});
  });
});
