import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockRewardInflation } from '@reward/__fixtures__';
import { useRewardInflation } from './useRewardInflation';

jest.useRealTimers();

describe('useRewardInflation hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useRewardInflation(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockRewardInflation);
  });
});
