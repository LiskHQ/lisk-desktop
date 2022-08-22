import { renderHook, act } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as defaultLimit } from 'src/const/config';
import { mockNewsFeed } from '../../__fixtures__';
import { useNewsFeed } from './useNewsFeed';

jest.useRealTimers();

describe('useNewsFeed hook', () => {
  const limit = 15;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useNewsFeed({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockNewsFeed.data.slice(0, limit),
      meta: {
        ...mockNewsFeed.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useNewsFeed({ config }), { wrapper });
    // expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockNewsFeed.data.slice(0, limit * 2),
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

  it.skip('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useNewsFeed({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockNewsFeed.data.slice(0, defaultLimit),
      meta: {
        ...mockNewsFeed.meta,
        count: defaultLimit,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });
});
