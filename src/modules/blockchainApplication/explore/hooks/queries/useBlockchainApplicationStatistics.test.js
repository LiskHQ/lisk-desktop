import { renderHook } from '@testing-library/react-hooks';
import { mockNetworkStatus } from '@network/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useBlockchainApplicationStatistics } from './useBlockchainApplicationStatistics';

jest.useRealTimers();

describe('useNetworkStatus hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useBlockchainApplicationStatistics(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockNetworkStatus);
  });
});
