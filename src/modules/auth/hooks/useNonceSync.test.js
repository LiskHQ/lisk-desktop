import { renderHook } from '@testing-library/react-hooks';
import * as ReactQuery from '@tanstack/react-query';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useAccounts } from 'src/modules/account/hooks';
import { mockAuth } from '@auth/__fixtures__';
import useNonceSync from './useNonceSync';

const mockedCurrentAccount = mockSavedAccounts[0];
const mockSetNonceByAccount = jest.fn();
const mockModifiedMockAuth = { ...mockAuth, data: { ...mockAuth.data, nonce: '2' } };

jest.mock('@account/hooks/useCurrentAccount', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));
jest.mock('@account/hooks/useAccounts');
jest.mock('@auth/hooks/queries/useAuth');

describe('useNonceSync', () => {
  it('renders properly', async () => {
    jest
      .spyOn(ReactQuery, 'useQueryClient')
      .mockReturnValue({ getQueryData: () => mockModifiedMockAuth });
    useAccounts.mockReturnValue({
      accounts: mockedCurrentAccount,
      setNonceByAccount: mockSetNonceByAccount,
      getNonceByAccount: jest.fn().mockReturnValue(3),
    });
    const { result } = renderHook(() => useNonceSync(), { wrapper });
    expect(result.current.accountNonce).toEqual(3);
    result.current.incrementNonce();
    expect(mockSetNonceByAccount).toHaveBeenCalled();
  });

  it('renders properly if auth nonce is undefined and no local nonce has been previously stored', () => {
    jest.spyOn(ReactQuery, 'useQueryClient').mockReturnValue({ getQueryData: () => {} });
    useAccounts.mockReturnValue({
      accounts: mockedCurrentAccount,
      setNonceByAccount: mockSetNonceByAccount,
      getNonceByAccount: jest.fn().mockReturnValue(undefined),
    });
    const { result } = renderHook(() => useNonceSync(), { wrapper });
    expect(result.current.accountNonce).toEqual(0);
  });

  it("updates local nonce if it's less than on-chain nonce", () => {
    jest
      .spyOn(ReactQuery, 'useQueryClient')
      .mockReturnValue({ getQueryData: () => mockModifiedMockAuth });
    useAccounts.mockReturnValue({
      accounts: mockedCurrentAccount,
      setNonceByAccount: mockSetNonceByAccount,
      getNonceByAccount: jest.fn().mockReturnValue(1),
    });
    const { result } = renderHook(() => useNonceSync(), { wrapper });
    expect(result.current.accountNonce).toEqual(2);
  });
});
