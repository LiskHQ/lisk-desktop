import { renderHook } from '@testing-library/react-hooks';
import { mockNetworkStatus } from '@network/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useNetworkStatus } from './useNetworkStatus';

jest.useRealTimers();

describe('useNetworkStatus hook', () => {
  const { result, waitFor } = renderHook(() => useNetworkStatus(), { wrapper });

  it('fetching data correctly', async () => {
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockNetworkStatus);
  });
});
