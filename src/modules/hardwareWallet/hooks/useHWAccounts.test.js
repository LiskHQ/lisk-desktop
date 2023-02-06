import { renderHook } from '@testing-library/react-hooks';
import { hwAccounts } from '../__fixtures__/hwAccounts';
import useHWAccounts from './useHWAccounts';

const mockState = {
  hardwareWallet: {
    accounts: hwAccounts,
  },
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
}));

describe('useHWAccounts', () => {
  const { result } = renderHook(() => useHWAccounts());
  it('returns the list of hardware wallet accounts', () => {
    expect(result.current.accounts).toEqual(hwAccounts);
  });
});
