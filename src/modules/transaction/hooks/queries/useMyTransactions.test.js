import { renderHook, act } from '@testing-library/react-hooks';
import { mockTransactions } from '@transaction/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as defaultLimit } from 'src/const/config';
import { useMyTransactions } from './useMyTransactions';

jest.useRealTimers();

describe('useMyTransactions hook', () => {
  const limit = mockTransactions.meta.total / 2;
  const config = { params: { limit } };

  it('fetches data correctly', async () => {
    const { result, waitFor } = renderHook(() => useMyTransactions({ config }), { wrapper });
    // Since placeholder data is used, then there's no initial data loading
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

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useMyTransactions({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockTransactions.data.slice(0, limit * 2),
      meta: {
        ...mockTransactions.meta,
        count: limit,
        offset: limit,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
    expect(result.current.hasNextPage).toBeFalsy();
    act(() => {
      result.current.fetchNextPage();
    });
    expect(result.current.hasNextPage).toBeFalsy();
  });

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useMyTransactions(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockTransactions.data.slice(0, defaultLimit),
      meta: {
        ...mockTransactions.meta,
        count: defaultLimit,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });
});
