import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockRewardsLocked } from '@pos/validator/__fixtures__';
import { useRewardsLocked } from './useRewardsLocked';

jest.useRealTimers();

describe('useRewardsLocked hook', () => {
  const config = { params: { address:'lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg' } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useRewardsLocked({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockRewardsLocked);
  });
});
