import { renderHook } from '@testing-library/react-hooks';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import * as accountHooks from '@account/hooks';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { useTransferableTokens } from './useTransferableTokens';
import { useAppsMetaTokens, useTokenBalances, useTokenSummary } from './queries';
import { mockAppsTokens } from '../__fixtures__';

jest.mock('@account/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('@account/hooks'),
}));

jest.mock('./queries/useTokenBalances');
jest.mock('./queries/useTokenSummary');
jest.mock('./queries/useAppsMetaTokens');

const mockCurrentAccount = mockSavedAccounts[0];
const mockAppMeta = mockBlockchainAppMeta.data[0];

beforeEach(() => {
  useAppsMetaTokens.mockReturnValue({ data: mockAppsTokens });
});

describe('useTransferableTokens hook', () => {
  jest.spyOn(accountHooks, 'useCurrentAccount').mockReturnValue([mockCurrentAccount]);
  const mockAllTokens = [
    { tokenID: '0000000100000000' },
    { tokenID: '0000000200000000' },
    { tokenID: '0000000300000000' },
  ];
  it('data should be an array', async () => {
    const mockResponse = { data: undefined, isLoading: true, isSuccess: false };
    useTokenBalances.mockReturnValue(mockResponse);
    useTokenSummary.mockReturnValue(mockResponse);
    const { result } = renderHook(() => useTransferableTokens(mockAppMeta), { wrapper });
    const { data } = result.current;
    expect(data).toEqual([]);
  });

  it('should return loading', async () => {
    const mockResponse = { data: undefined, isLoading: true, isSuccess: false };
    useTokenBalances.mockReturnValue(mockResponse);
    useTokenSummary.mockReturnValue(mockResponse);
    const { result } = renderHook(() => useTransferableTokens(mockAppMeta), { wrapper });
    const { isLoading, isSuccess, data } = result.current;
    expect(isLoading).toBeTruthy();
    expect(isSuccess).toBeFalsy();
    expect(data).toEqual([]);
  });

  it('should return success', async () => {
    const mockResponse = { data: {}, isLoading: false, isSuccess: true };
    useTokenBalances.mockReturnValue(mockResponse);
    useTokenSummary.mockReturnValue(mockResponse);
    const { result, waitFor } = renderHook(() => useTransferableTokens(mockAppMeta), { wrapper });
    const { isLoading, isSuccess } = result.current;
    await waitFor(() => isSuccess);
    expect(isLoading).toBeFalsy();
    expect(isSuccess).toBeTruthy();
  });

  it('should return loading if one api is pending', async () => {
    const mockTokensBalance = { data: undefined, isLoading: true, isSuccess: false };
    const mockTokenSummary = { data: {}, isLoading: false, isSuccess: true };

    useTokenBalances.mockReturnValue(mockTokensBalance);
    useTokenSummary.mockReturnValue(mockTokenSummary);
    const { result } = renderHook(() => useTransferableTokens(mockAppMeta), { wrapper });
    const { isLoading, isSuccess } = result.current;
    expect(isLoading).toBeTruthy();
    expect(isSuccess).toBeFalsy();
  });

  it('should return all supported token if supported token is empty array', async () => {
    const mockTokensBalance = { data: { data: mockAllTokens }, isLoading: false, isSuccess: true };
    const mockTokenSummary = {
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
    useTokenBalances.mockReturnValue(mockTokensBalance);
    useTokenSummary.mockReturnValue(mockTokenSummary);

    const { result } = renderHook(() => useTransferableTokens(mockAppMeta), {
      wrapper,
    });
    const { data } = result.current;

    expect(data).toEqual(mockAllTokens);
  });

  it('should return filter supported token', async () => {
    const mockSupportedToken = [mockAllTokens[0], mockAllTokens[2]];
    const mockTokensBalance = { data: { data: mockAllTokens }, isLoading: false, isSuccess: true };
    const mockTokenSummary = {
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
    useTokenBalances.mockReturnValue(mockTokensBalance);
    useTokenSummary.mockReturnValue(mockTokenSummary);
    const { result } = renderHook(() => useTransferableTokens(mockAppMeta), { wrapper });
    const { data, isSuccess } = result.current;
    expect(isSuccess).toBeTruthy();
    expect(data).toEqual(mockSupportedToken);
    expect(data).not.toEqual(mockAllTokens);
  });
});
