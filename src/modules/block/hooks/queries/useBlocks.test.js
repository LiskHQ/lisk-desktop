import { renderHook } from '@testing-library/react-hooks';
import { mockBlocks } from '@block/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as defaultLimit } from 'src/const/config';
import { useBlocks } from './useBlocks';

jest.useRealTimers();

describe('useBlocks hook', () => {
  const limit = 2;
  const config = { params: { limit: 2 } };
  let hookResult;

  beforeEach(() => {
    hookResult = renderHook(() => useBlocks({ config }), { wrapper });
  });

  it.skip('fetching data correctly', async () => {
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockBlocks.data.slice(0, limit),
      meta: {
        ...mockBlocks.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it.skip('should fetch next set of data correctly', async () => {
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: [],
      meta: {
        count: limit,
        offset: 35,
        total: 30,
      },
    };

    result.current.fetchNextPage({
      pageParam: {
        limit,
        offset: 35,
      },
    });

    expect(result.current.isFetchingNextPage).toBeTruthy();
    await waitFor(() => result.current.isFetchingNextPage);
    await waitFor(() => !result.current.isFetchingNextPage);
    expect(result.current.data).toEqual(expectedResponse);
  });

  it.skip('fetches data without params correctly', async () => {
    hookResult = renderHook(() => useBlocks({ config }), { wrapper });
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockBlocks.data.slice(0, defaultLimit),
      meta: {
        ...mockBlocks.meta,
        count: defaultLimit,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });
});
