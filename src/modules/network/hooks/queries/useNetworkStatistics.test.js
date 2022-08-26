import { renderHook } from '@testing-library/react-hooks';
import { mockNetworkStatistics } from '@network/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useNetworkStatistics } from '.';

jest.useRealTimers();

describe('useNetworkStatistics hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useNetworkStatistics(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockNetworkStatistics);
  });
});
