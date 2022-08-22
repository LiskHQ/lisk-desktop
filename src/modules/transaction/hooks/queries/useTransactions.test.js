import { renderHook } from '@testing-library/react-hooks';
import { mockTransactions } from '@transaction/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useTransactions } from './useTransactions';

jest.useRealTimers();

describe('useTransactions hook', () => {
  const limit = 2;
  const config = { params: { limit: 2 } };
  const { result, waitFor } = renderHook(() => useTransactions({ config }), { wrapper });

  it('fetching data correctly', async () => {
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockTransactions.data.slice(0, limit),
      meta: {
        ...mockTransactions.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });
});
