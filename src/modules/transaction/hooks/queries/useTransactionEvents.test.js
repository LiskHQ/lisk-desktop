import { renderHook, act } from '@testing-library/react-hooks';
import { mockEvents } from '@transaction/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useTransactionEvents } from './useTransactionEvents';

jest.useRealTimers();

describe('useTransactionEvent hook', () => {
  const limit = 15;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useTransactionEvents({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockEvents.data.slice(0, limit),
      meta: {
        ...mockEvents.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useTransactionEvents({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockEvents.data.slice(0, limit * 2),
      meta: {
        ...mockEvents.meta,
        count: limit,
        offset: limit,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
    expect(result.current.hasNextPage).toBeFalsy();
  });
});
