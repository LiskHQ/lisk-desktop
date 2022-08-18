import { renderHook, act } from '@testing-library/react-hooks';
import { mockBlocks } from '@block/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as defaultLimit } from 'src/const/config';
import { useBlocks } from './useBlocks';

jest.useRealTimers();

describe('useBlocks hook', () => {
  const limit = 2;
  const config = { params: { limit: 2 } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useBlocks({ config }), { wrapper });
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

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useBlocks({ config }), { wrapper });
    await waitFor(() => result.current.isSuccess);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockBlocks.data.slice(0, 4),
      meta: {
        count: limit,
        offset: 2,
        total: 30,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it.skip('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useBlocks({ config }), { wrapper });
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
