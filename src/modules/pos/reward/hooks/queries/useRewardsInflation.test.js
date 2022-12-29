import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockRewardsInflation } from '@pos/validator/__fixtures__';
import { useRewardsInflation } from './useRewardsInflation';

jest.useRealTimers();

describe('useRewardsInflation hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useRewardsInflation(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockRewardsInflation);
  });
});
