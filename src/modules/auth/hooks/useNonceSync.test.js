import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useAuth } from '@auth/hooks/queries';
import { useAccounts } from 'src/modules/account/hooks';
import { mockAuth, mockAuthMultiSig } from '@auth/__fixtures__';
import useNonceSync from './useNonceSync';

const mockedCurrentAccount = mockSavedAccounts[0];
const mockSetNonceByAccount = jest.fn();
const mockResetNonceByAccount = jest.fn();

jest.mock('@account/hooks/useCurrentAccount', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));
jest.mock('@account/hooks/useAccounts');
jest.mock('@auth/hooks/queries/useAuth');

describe('useNonceSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders properly', async () => {
    const mockModifiedMockAuth = { data: { ...mockAuthMultiSig.data, nonce: '3' } };
    useAuth.mockReturnValue({ data: mockModifiedMockAuth });
    useAccounts.mockReturnValue({
      accounts: mockedCurrentAccount,
      setNonceByAccount: mockSetNonceByAccount,
      getNonceByAccount: jest.fn().mockReturnValue(3),
    });
    const { result } = renderHook(() => useNonceSync(), { wrapper });
    expect(result.current.accountNonce).toEqual('3');
    result.current.incrementNonce();
    expect(mockSetNonceByAccount).toHaveBeenCalled();
  });

  it('renders properly if auth nonce is undefined and no local nonce has been previously stored', () => {
    useAuth.mockReturnValue({});

    useAccounts.mockReturnValue({
      accounts: mockedCurrentAccount,
      setNonceByAccount: mockSetNonceByAccount,
      getNonceByAccount: jest.fn().mockReturnValue(undefined),
    });
    const { result } = renderHook(() => useNonceSync(), { wrapper });
    expect(result.current.accountNonce).toEqual('0');
  });

  it("updates local nonce if it's less than on-chain nonce", () => {
    const mockModifiedMockAuth = { data: { ...mockAuthMultiSig.data, nonce: '2' } };
    useAuth.mockReturnValue({ data: mockModifiedMockAuth });
    useAccounts.mockReturnValue({
      accounts: mockedCurrentAccount,
      setNonceByAccount: mockSetNonceByAccount,
      getNonceByAccount: jest.fn().mockReturnValue(1),
    });
    const { result } = renderHook(() => useNonceSync(), { wrapper });
    expect(result.current.accountNonce).toEqual('2');
  });

  it("updates local nonce if it's less than on-chain nonce", () => {
    const mockModifiedMockAuth = { data: { ...mockAuthMultiSig.data, nonce: '2' } };
    useAuth.mockReturnValue({ data: mockModifiedMockAuth });
    useAccounts.mockReturnValue({
      accounts: mockedCurrentAccount,
      setNonceByAccount: mockSetNonceByAccount,
      resetNonceByAccount: mockResetNonceByAccount,
      getNonceByAccount: jest.fn().mockReturnValue(3),
    });
    const { result } = renderHook(() => useNonceSync(), { wrapper });
    result.current.resetNonce();
    expect(mockResetNonceByAccount).toHaveBeenCalled();
  });

  it("updates local nonce if it's less than on-chain nonce", () => {
    const mockModifiedMockAuth = { data: { ...mockAuth.data, nonce: '2' } };
    useAuth.mockReturnValue({ data: mockModifiedMockAuth });
    useAccounts.mockReturnValue({
      accounts: mockedCurrentAccount,
      setNonceByAccount: mockSetNonceByAccount,
      getNonceByAccount: jest.fn().mockReturnValue(1),
    });
    renderHook(() => useNonceSync(), { wrapper });
    expect(mockSetNonceByAccount).toHaveBeenCalledTimes(0);
  });
});
