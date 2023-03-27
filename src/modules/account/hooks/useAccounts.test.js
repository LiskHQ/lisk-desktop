import { renderHook, act } from '@testing-library/react-hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import actionTypes from '@account/store/actionTypes';
import { useAccounts } from './useAccounts';

const mockDispatch = jest.fn();
const accountStateObject = { [mockSavedAccounts[0].metadata.address]: mockSavedAccounts[0] };
const mockState = {
  account: {
    list: accountStateObject,
  },
};
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

describe('useAccount hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });
  const { result } = renderHook(() => useAccounts());
  it('setAccount Should not trigger on mounting', async () => {
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  it('setAccount should dispatch an action', async () => {
    const { setAccount } = result.current;
    const expectedAction = {
      type: actionTypes.addAccount,
      encryptedAccount: mockSavedAccounts[0],
    };
    act(() => {
      setAccount(mockSavedAccounts[0]);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('accounts should return and convert state as an array', async () => {
    const { accounts } = result.current;
    const expectArrayAccounts = [mockSavedAccounts[0]];
    expect(accounts).toMatchObject(expectArrayAccounts);
  });

  it('getAccount should return specific account selected by address', async () => {
    const { getAccountByAddress } = result.current;
    const address = mockSavedAccounts[0].metadata.address;
    const account = getAccountByAddress(address);
    expect(account).toMatchObject(mockSavedAccounts[0]);
  });

  it('deleteAccount should dispatch an action', async () => {
    const { deleteAccountByAddress } = result.current;
    const address = mockSavedAccounts[0].metadata.address;
    const expectedAction = {
      type: actionTypes.deleteAccount,
      address,
    };
    act(() => {
      deleteAccountByAddress(address);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
