import { renderHook } from '@testing-library/react-hooks';
import { mockLegacy } from '@legacy/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useTokensTopLskBalance } from './useTokensTopLskBalance';

jest.useRealTimers();

describe('useTokensTopLskBalance hook', () => {
  const limit = 5;
  const config = {
    params: { publicKey: '6e0291140a28148267e30ac69b5e6965680190dc7de13b0a859bda556c9f0f86' },
  };
  let hookResult;

  beforeEach(() => {
    hookResult = renderHook(() => useTokensTopLskBalance({ config }), { wrapper });
  });

  it.skip('fetches data correctly', async () => {
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockLegacy);
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

  it.skip('returns error if param is invalid', async () => {
    const errorConfig = {
      params: { publicKey: '6e0291140a28148267e30ac69b5e6965680190dc7de13b0a859bda556c9f0f86' },
    };
    hookResult = renderHook(() => useTokensTopLskBalance({ config: errorConfig }), { wrapper });
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      error: true,
      message: 'Unknown input parameter(s): publicKey',
    };

    expect(result.current.error).toEqual(expectedResponse);
  });
});
