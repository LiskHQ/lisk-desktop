import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as limit } from 'src/const/config';

import { mockCustomInfiniteQuery } from '../__fixtures__';
import { useCustomQuery } from './useCustomQuery';

jest.useRealTimers();

describe('useCustomQuery hook', () => {
  const config = {
    baseURL: 'http://127.0.0.1',
    url: '/mock/custom-infinite-query',
    method: 'get',
  };
  const keys = ['CUSTOM_INFINITE_QUERY'];

  it('fetch data correctly', async () => {
    const { result, waitFor } = renderHook(() => useCustomQuery({ config, keys }), { wrapper });

    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => result.current.isFetched);

    expect(result.current.isSuccess).toBeTruthy();

    const expectedResponse = {
      data: mockCustomInfiniteQuery.data.slice(0, limit),
      meta: {
        ...mockCustomInfiniteQuery.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetch not fail if config not passed', async () => {
    const { result, waitFor } = renderHook(() => useCustomQuery({ keys }), { wrapper });

    await waitFor(() => result.current.isFetching);
    expect(!result.current.data).toBeTruthy();
  });
});
