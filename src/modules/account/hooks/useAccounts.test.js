import { renderHook, act } from '@testing-library/react-hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import actionTypes from '@account/store/actionTypes';
import mockApplications from '@tests/fixtures/blockchainApplicationsManage';
import { useAccounts } from './useAccounts';

const txHex = 'a24f94966cf213deb90854c41cf1f27906135b7001a49e53a9722ebf5fc67481';
const accountNonce = 2;
const { chainID, chainName } = mockApplications[0];
const networkChainIDKey = `${chainName}:${chainID}`;

const mockDispatch = jest.fn();
const accountStateObject = { [mockSavedAccounts[0].metadata.address]: mockSavedAccounts[0] };
const mockState = {
  account: {
    list: accountStateObject,
    localNonce: {
      [mockSavedAccounts[0].metadata.address]: {
        [networkChainIDKey]: {
          [txHex]: accountNonce,
        },
      },
    },
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

  it('Should return specific account selected by pubkey', async () => {
    const { getAccountByPublicKey } = result.current;
    const pubkey = mockSavedAccounts[0].metadata.pubkey;
    const account = getAccountByPublicKey(pubkey);
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

  it('setNonceByAccount should dispatch an action', async () => {
    const { setNonceByAccount } = result.current;
    const expectedAction = {
      type: actionTypes.setAccountNonce,
      address: mockSavedAccounts[0].metadata.address,
      nonce: 2,
      transactionHex: txHex,
      networkChainIDKey,
    };
    act(() => {
      setNonceByAccount(mockSavedAccounts[0].metadata.address, 2, txHex, networkChainIDKey);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('getNonceByAccount should retrieve stored nonce', async () => {
    const { getNonceByAccount } = result.current;
    const storedNonce = getNonceByAccount(mockSavedAccounts[0].metadata.address, networkChainIDKey);
    expect(storedNonce).toEqual(accountNonce);
  });

  it('getNonceByAccount should retrieve 0 if no stored nonce', async () => {
    const { getNonceByAccount } = result.current;
    const storedNonce = getNonceByAccount(mockSavedAccounts[1].metadata.address, networkChainIDKey);
    expect(storedNonce).toEqual(0);
  });
});
