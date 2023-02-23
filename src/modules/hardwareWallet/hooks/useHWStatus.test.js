import { renderHook } from '@testing-library/react-hooks';
import { mockHWCurrentDevice } from '@hardwareWallet/__fixtures__';
import { useSelector } from 'react-redux';
import { useHWStatus } from './useHWStatus';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('useHWStatus hook', () => {
  it('returns the device details', () => {
    const mockAppState = {
      hardwareWallet: {
        currentDevice: mockHWCurrentDevice,
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
