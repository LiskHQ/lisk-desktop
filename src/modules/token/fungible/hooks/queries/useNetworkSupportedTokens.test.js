import { rest } from 'msw';
import { renderHook } from '@testing-library/react-hooks';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { API_VERSION } from 'src/const/config';
import { server } from 'src/service/mock/server';
import { queryWrapper as wrapper, queryClient } from 'src/utils/test/queryWrapper';
import { useNetworkSupportedTokens } from './useNetworkSupportedTokens';
import { mockAppsTokens, mockTokenSummary } from '../../__fixtures__';

jest.useRealTimers();
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');

describe('useNetworkSupportedTokens', () => {
  const mockCurrentApplication = mockManagedApplications[0];
  const mockSetCurrentApplication = jest.fn();

  useCurrentApplication.mockReturnValue([mockCurrentApplication, mockSetCurrentApplication]);

  it('should fetch supported network tokens', async () => {
    const { result, waitFor } = renderHook(
      () => useNetworkSupportedTokens(mockBlockchainAppMeta.data[0]),
      { wrapper }
    );

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toEqual(mockAppsTokens.data);
  });

  it('should get all supported tokens if network support all tokens', async () => {
    queryClient.resetQueries();
    server.resetHandlers();
    server.use(
      rest.get(`*/api/${API_VERSION}/token/summary`, async (req, res, ctx) => {
        const response = {
          ...mockTokenSummary.data,
          supportedTokens: {
            ...mockTokenSummary.data.supportedTokens,
            isSupportAllTokens: true,
            exactTokenIDs: [],
            patternTokenIDs: [],
          },
        };
        return res(ctx.json(response));
      })
    );

    const { result, waitFor } = renderHook(
      () => useNetworkSupportedTokens(mockBlockchainAppMeta.data[0]),
      { wrapper }
    );

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toEqual(mockAppsTokens.data);
  });

  it('should not return tokens if tokens meta data fails', async () => {
    queryClient.resetQueries();
    server.resetHandlers();

    server.use(
      rest.get(`*/api/${API_VERSION}/token/summary`, async (req, res, ctx) => res(ctx.json({})))
    );

    const { result, waitFor } = renderHook(
      () => useNetworkSupportedTokens(mockBlockchainAppMeta.data[0]),
      { wrapper }
    );

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toEqual([]);
  });
});
