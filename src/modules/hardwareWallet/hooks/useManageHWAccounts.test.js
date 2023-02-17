import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import { setHWAccounts, removeHWAccounts } from '../store/actions';
import { hwAccounts } from '../__fixtures__/hwAccounts';
import { getHWAccounts } from '../utils/getHWAccounts';
import useManageHWAccounts from './useManageHWAccounts';

jest.useRealTimers();

const mockDispatch = jest.fn();
const mockAppState = {
  hardwareWallet: {
    currentDevice: {
      deviceId: 20231,
      status: 'connected',
    },
  },
  settings: {
    hardwareAccounts: {},
  },
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock('../utils/getHWAccounts');
getHWAccounts.mockResolvedValue(hwAccounts);

describe('useManageHWAccounts hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('stores the list of accounts in the hardware wallet', async () => {
    useSelector.mockImplementation((callback) => callback(mockAppState));
    const { waitFor } = renderHook(() => useManageHWAccounts());

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      const hwWalletAccountsDetails = setHWAccounts(hwAccounts);
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining(hwWalletAccountsDetails));
    });
  });

  it('removes the list of accounts when the device is disconnected', async () => {
    const updatedMockAppState = {
      hardwareWallet: {
        currentDevice: {
          deviceId: 20231,
          status: 'disconnected',
        },
        accounts: hwAccounts,
      },
      settings: {
        hardwareAccounts: {
          20231: [
            {
              address: 'a07e06d3d21bfcbd6e6cb158a0adc18b6ccc92db66dc8a323c7462af9c539fab',
              name: 'masoud123',
            },
            {
              address: '49dc55a205bf1fecbee41bde6e354eaa85fdc3c2809e85f5720a83986fad4b0a',
              name: 'masoud456',
            },
          ],
        },
      },
    };
    useSelector.mockImplementation((callback) => callback(updatedMockAppState));
    const { waitFor } = renderHook(() => useManageHWAccounts());

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(removeHWAccounts());
    });
  });
});
