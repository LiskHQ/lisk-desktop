import { renderHook } from '@testing-library/react-hooks';
// import { cryptography } from '@liskhq/lisk-client';
import useCheckInitializedAccount from '@account/hooks/queries/useCheckInitializedAccount';
// import { storeAccounts, removeAccounts } from '../store/actions/actions';
import { hwAccounts } from '../__fixtures__/hwAccounts';
import useManageHWAccounts from './useManageHWAccounts';

jest.useRealTimers();
const mockHWAccounts = hwAccounts;
const mockDispatch = jest.fn();
const mockSelector = {
  settings: {
    hardwareAccounts: {
      'Nano S': mockHWAccounts,
    },
  },
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (fn) => fn(mockSelector),
}));

jest.mock('@hardwareWallet/manager/HWManager', () => ({
  getActiveDeviceInfo: jest.fn(() => mockHWAccounts[0].hw),
  getPublicKey: jest.fn(() => mockHWAccounts[0].metadata.pubkey),
}));

jest.mock('@liskhq/lisk-client', () => ({
  ...jest.requireActual('@liskhq/lisk-client'),
  cryptography: {
    ...jest.requireActual('@liskhq/lisk-client').cryptography,
    address: {
      getAddressFromPublicKey: jest.fn(() => 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd'),
    },
  },
}));

jest.mock('@common/hooks/useCheckInitializedAccount');
useCheckInitializedAccount.mockReturnValue(true);

describe('useManageHWAccounts hook', () => {
  renderHook(() => useManageHWAccounts());

  it('stores the list of accounts in the hardware wallet', () => {
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toMatchSnapshot();
  });
});
