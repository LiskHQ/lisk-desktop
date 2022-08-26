import { renderHook, act } from '@testing-library/react-hooks';
import { mockReceivedVotes } from '@dpos/validator/__fixtures__';
import { LIMIT as defaultLimit } from 'src/const/config';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useReceivedVotes } from './useReceivedVotes';

jest.useRealTimers();

describe('useReceivedVotes hook', () => {
  const limit = 15;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useReceivedVotes({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: {
        ...mockReceivedVotes.data,
        votes: mockReceivedVotes.data.votes?.slice(0, limit),
      },
      meta: {
        ...mockReceivedVotes.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useReceivedVotes(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: {
        ...mockReceivedVotes.data,
        votes: mockReceivedVotes.data.votes?.slice(0, defaultLimit),
      },
      meta: {
        ...mockReceivedVotes.meta,
        count: defaultLimit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useReceivedVotes({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: {
        ...mockReceivedVotes.data,
        votes: mockReceivedVotes.data.votes?.slice(0, limit * 2),
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
