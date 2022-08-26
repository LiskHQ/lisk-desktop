import { renderHook, act } from '@testing-library/react-hooks';
import { mockDelegates } from '@dpos/validator/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as defaultLimit } from 'src/const/config';
import { useDelegates } from '.';

jest.useRealTimers();

describe('useDelegates hook', () => {
  const limit = 15;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useDelegates({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockDelegates.data.slice(0, limit),
      meta: {
        ...mockDelegates.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useDelegates(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockDelegates.data.slice(0, defaultLimit),
      meta: {
        ...mockDelegates.meta,
        count: defaultLimit,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useDelegates({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockDelegates.data.slice(0, limit * 2),
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
    const { result, waitFor } = renderHook(() => useDelegates({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockDelegates.data.slice(0, defaultLimit),
      meta: {
        ...mockDelegates.meta,
        count: defaultLimit,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });
});
