import { renderHook, act } from '@testing-library/react-hooks';
import { mockTransactionStatistics } from '@transaction/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as defaultLimit } from 'src/const/config';
import { useTransactionStatistics } from '.';

jest.useRealTimers();

describe('useTransactionStatistics hook', () => {
  const limit = mockTransactionStatistics.meta.total / 2;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useTransactionStatistics({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: {
        ...mockTransactionStatistics.data,
        timeline: Object.keys(mockTransactionStatistics.data.timeline).reduce(
          (acc, key) => ({
            ...acc,
            [key]: mockTransactionStatistics.data.timeline[key].slice(0, limit),
          }),
          {}
        ),
      },
      meta: {
        ...mockTransactionStatistics.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useTransactionStatistics({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: {
        ...mockTransactionStatistics.data,
        timeline: Object.keys(mockTransactionStatistics.data.timeline).reduce(
          (acc, key) => ({
            ...acc,
            [key]: mockTransactionStatistics.data.timeline[key].slice(0, limit * 2),
          }),
          {}
        ),
      },
      meta: {
        count: limit,
        offset: limit,
        total: 30,
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
    const { result, waitFor } = renderHook(() => useTransactionStatistics(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: {
        ...mockTransactionStatistics.data,
        timeline: Object.keys(mockTransactionStatistics.data.timeline).reduce(
          (acc, key) => ({
            ...acc,
            [key]: mockTransactionStatistics.data.timeline[key].slice(0, defaultLimit),
          }),
          {}
        ),
      },
      meta: {
        ...mockTransactionStatistics.meta,
        count: defaultLimit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });
});
