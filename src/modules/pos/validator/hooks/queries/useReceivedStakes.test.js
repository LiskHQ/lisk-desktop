import { renderHook, act } from '@testing-library/react-hooks';
import { mockReceivedStakes } from '@pos/validator/__fixtures__';
import { LIMIT as defaultLimit } from 'src/const/config';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useReceivedStakes } from './useReceivedStakes';

jest.useRealTimers();

describe('useReceivedStakes hook', () => {
  const limit = 15;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useReceivedStakes({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: {
        ...mockReceivedStakes.data,
        stakers: mockReceivedStakes.data.stakers?.slice(0, limit),
      },
      meta: {
        ...mockReceivedStakes.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useReceivedStakes(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: {
        ...mockReceivedStakes.data,
        stakers: mockReceivedStakes.data.stakers?.slice(0, defaultLimit),
      },
      meta: {
        ...mockReceivedStakes.meta,
        count: defaultLimit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useReceivedStakes({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: {
        ...mockReceivedStakes.data,
        stakers: mockReceivedStakes.data.stakers?.slice(0, limit * 2),
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
});
