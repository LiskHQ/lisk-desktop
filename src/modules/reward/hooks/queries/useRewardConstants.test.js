import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockRewardConstants } from '@reward/__fixtures__';
import { useRewardConstants } from '@reward/hooks/queries';

jest.useRealTimers();

describe('useRewardConstants hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useRewardConstants(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockRewardConstants);
  });
});
