import { renderHook, act } from '@testing-library/react-hooks';
import { mockPeers } from '@network/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as defaultLimit } from 'src/const/config';
import { usePeers } from './usePeers';

jest.useRealTimers();

describe('useBlocks hook', () => {
  const limit = 15;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => usePeers({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockPeers.data.slice(0, limit),
      meta: {
        ...mockPeers.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetching data correctly without any options/config', async () => {
    const { result, waitFor } = renderHook(() => usePeers(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual({
      data: mockPeers.data.slice(0, defaultLimit),
      meta: {
        ...mockPeers.meta,
        count: defaultLimit,
      },
    });
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => usePeers({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockPeers.data.slice(0, limit * 2),
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
