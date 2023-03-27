import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as limit } from 'src/const/config';

import { mockCustomInfiniteQuery } from '../__fixtures__';
import { useCustomInfiniteQuery } from './useCustomInfiniteQuery';

jest.useRealTimers();

describe('useCustomInfiniteQuery hook', () => {
  const config = {
    baseURL: 'http://127.0.0.1',
    url: '/mock/custom-infinite-query',
    method: 'get',
    params: {
      limit,
    },
  };
  const keys = ['CUSTOM_INFINITE_QUERY'];

  it('fetch data correctly', async () => {
    const { result, waitFor } = renderHook(() => useCustomInfiniteQuery({ config, keys }), {
      wrapper,
    });

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
});
