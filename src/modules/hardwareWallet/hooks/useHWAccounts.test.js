import { renderHook } from '@testing-library/react-hooks';
import * as clientLedgerHWCommunication from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';
import { mockHWAccounts, mockHWCurrentDevice } from '../__fixtures__';
import useHWAccounts from './useHWAccounts';

jest.spyOn(clientLedgerHWCommunication, 'getMultipleAddresses').mockResolvedValue({
  1: {
    pubKey: 'a07e06d3d21bfcbd6e6cb158a0adc18b6ccc92db66dc8a323c7462af9c539fab',
    address: 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd',
  },
  2: {
    pubKey: '49dc55a205bf1fecbee41bde6e354eaa85fdc3c2809e85f5720a83986fad4b0a',
    address: 'lsk5d58ubcybferq92wh3x82ca24bgef3tzqrdayu',
  },
});

const mockState = {
  hardwareWallet: {
    accounts: mockHWAccounts,
    currentDevice: mockHWCurrentDevice,
  },
};
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

describe('useHWAccounts', () => {
  it('returns the list of hardware wallet accounts', async () => {
    const { result, waitFor } = renderHook(() => useHWAccounts(2));
    await waitFor(() => result.current.isLoading === false);
    const expected = mockHWAccounts.map((account) => ({
      hw: mockHWCurrentDevice,
      metadata: { ...account.metadata, creationTime: undefined },
    }));
    const received = result.current.hwAccounts.map((hwAccount) => ({
      hw: hwAccount.hw,
      metadata: {
        ...hwAccount.metadata,
        creationTime: undefined,
      },
    }));
    expect(received).toEqual(expected);
  });
});
