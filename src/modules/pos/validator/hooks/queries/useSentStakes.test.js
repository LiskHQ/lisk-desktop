/* istanbul ignore file */
import { renderHook } from '@testing-library/react-hooks';
import { mockSentStakes } from '@pos/validator/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useSentStakes } from '.';

jest.useRealTimers();

describe('useSentStakes hook', () => {
  const config = { params: { address: 'lsk74ar23k2zk3mpsnryxbxf5yf9ystudqmj4oj6e' } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useSentStakes({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();

    expect(result.current.data).toEqual(mockSentStakes);
  });
});
