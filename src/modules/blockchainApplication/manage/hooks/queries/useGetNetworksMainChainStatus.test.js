import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import networks, { networkKeys } from 'src/modules/network/configuration/networks';
import { mockNetworkStatus } from 'src/modules/network/__fixtures__';
import { useGetNetworksMainChainStatus } from './useGetNetworksMainChainStatus';

jest.useRealTimers();

describe('useBlockchainApplicationMeta hook', () => {
  const limit = 15;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useGetNetworksMainChainStatus({ config }), {
      wrapper,
    });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = Object.keys(networks).reduce(
      (output, networkKey) =>
        networkKey === networkKeys.customNode
          ? output
          : { ...output, [networkKey]: mockNetworkStatus },
      {}
    );
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useGetNetworksMainChainStatus(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = Object.keys(networks).reduce(
      (output, networkKey) =>
        networkKey === networkKeys.customNode
          ? output
          : { ...output, [networkKey]: mockNetworkStatus },
      {}
    );
    expect(result.current.data).toEqual(expectedResponse);
  });
});
