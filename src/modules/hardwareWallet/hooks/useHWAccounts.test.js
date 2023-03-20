import { renderHook } from '@testing-library/react-hooks';
import { mockHWAccounts } from '../__fixtures__';
import useHWAccounts from './useHWAccounts';

const mockState = {
  hardwareWallet: {
    accounts: mockHWAccounts,
  },
};
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

describe('useHWAccounts', () => {
  const { result } = renderHook(() => useHWAccounts());
  it('returns the list of hardware wallet accounts', () => {
    expect(result.current.accounts).toEqual(mockHWAccounts);
  });
});
