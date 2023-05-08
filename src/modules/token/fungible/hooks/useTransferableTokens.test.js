import { renderHook } from '@testing-library/react-hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import * as queries from '@token/fungible/hooks/queries';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import * as accountHooks from '@account/hooks';
import { useTransferableTokens } from './useTransferableTokens';

jest.mock('@account/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('@account/hooks'),
}));
jest.mock('@token/fungible/hooks/queries', () => ({
  __esModule: true,
  ...jest.requireActual('@token/fungible/hooks/queries'),
}));

const mockCurrentAccount = mockSavedAccounts[0];

describe('useTransferableTokens hook', () => {
  jest.spyOn(accountHooks, 'useCurrentAccount').mockReturnValue([mockCurrentAccount]);
  const mockAllTokens = [
    { tokenID: '0000000100000000' },
    { tokenID: '0000000200000000' },
    { tokenID: '0000000300000000' },
  ];
  it('data should be an array', async () => {
    const mockResponse = { data: undefined, isLoading: true, isSuccess: false };
    jest.spyOn(queries, 'useTokenBalances').mockReturnValue(mockResponse);
    jest.spyOn(queries, 'useTokensSupported').mockReturnValue(mockResponse);
    const { result } = renderHook(() => useTransferableTokens(), { wrapper });
    const { data } = result.current;
    expect(data).toEqual([]);
  });

  it('should return loading', async () => {
    const mockResponse = { data: undefined, isLoading: true, isSuccess: false };
    jest.spyOn(queries, 'useTokenBalances').mockReturnValue(mockResponse);
    jest.spyOn(queries, 'useTokensSupported').mockReturnValue(mockResponse);
    const { result } = renderHook(() => useTransferableTokens(), { wrapper });
    const { isLoading, isSuccess, data } = result.current;
    expect(isLoading).toBeTruthy();
    expect(isSuccess).toBeFalsy();
    expect(data).toEqual([]);
  });

  it('should return success', async () => {
    const mockResponse = { data: {}, isLoading: false, isSuccess: true };
    jest.spyOn(queries, 'useTokenBalances').mockReturnValue(mockResponse);
    jest.spyOn(queries, 'useTokensSupported').mockReturnValue(mockResponse);
    const { result, waitFor } = renderHook(() => useTransferableTokens(), { wrapper });
    const { isLoading, isSuccess } = result.current;
    await waitFor(() => isSuccess);
    expect(isLoading).toBeFalsy();
    expect(isSuccess).toBeTruthy();
  });

  it('should return loading if one api is pending', async () => {
    const mockTokensBalance = { data: undefined, isLoading: true, isSuccess: false };
    const mockTokensSupported = { data: {}, isLoading: false, isSuccess: true };
    jest.spyOn(queries, 'useTokenBalances').mockReturnValue(mockTokensBalance);
    jest.spyOn(queries, 'useTokensSupported').mockReturnValue(mockTokensSupported);
    const { result } = renderHook(() => useTransferableTokens(), { wrapper });
    const { isLoading, isSuccess } = result.current;
    expect(isLoading).toBeTruthy();
    expect(isSuccess).toBeFalsy();
  });

  it('should return all supported token if supported token is empty array', async () => {
    const mockTokensBalance = { data: { data: mockAllTokens }, isLoading: false, isSuccess: true };
    const mockTokensSupported = {
      data: {
        data: {
          supportedTokens: {
            isSupportAllTokens: true,
            exactTokenIDs: [],
            patternTokenIDs: [],
          },
        },
      },
      isLoading: false,
      isSuccess: true,
    };
    jest.spyOn(queries, 'useTokenBalances').mockReturnValue(mockTokensBalance);
    jest.spyOn(queries, 'useTokensSupported').mockReturnValue(mockTokensSupported);
    const { result } = renderHook(() => useTransferableTokens(), { wrapper });
    const { data } = result.current;

    expect(data).toEqual(mockAllTokens);
  });

  it('should return filter supported token', async () => {
    const mockSupportedToken = [mockAllTokens[0], mockAllTokens[2]];
    const mockTokensBalance = { data: { data: mockAllTokens }, isLoading: false, isSuccess: true };
    const mockTokensSupported = {
      data: {
        data: {
          supportedTokens: {
            isSupportAllToken: false,
            exactTokenIDs: ['0000000100000000', '0000000300000000'],
            patternTokenIDs: ['00000020******'],
          },
        },
      },
      isLoading: false,
      isSuccess: true,
    };
    jest.spyOn(queries, 'useTokenBalances').mockReturnValue(mockTokensBalance);
    jest.spyOn(queries, 'useTokensSupported').mockReturnValue(mockTokensSupported);
    const { result } = renderHook(() => useTransferableTokens(), { wrapper });
    const { data, isSuccess } = result.current;
    expect(isSuccess).toBeTruthy();
    expect(data).toEqual(mockSupportedToken);
    expect(data).not.toEqual(mockAllTokens);
  });
});
