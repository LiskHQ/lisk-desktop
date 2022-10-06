import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as limit } from 'src/const/config';

import { mockCustomInfiniteQuery } from '../__fixtures__';
import { useCustomQuery } from './useCustomQuery';

jest.useRealTimers();


const mockState = {
  account: {
    list: [],
  },
  blockChainApplications: {
    current: {},
  },
  network: {
    name: 'testnet'
  }
};

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));


describe('useCustomQuery hook', () => {
  const config = {
    baseURL: 'http://127.0.0.1',
    url: '/mock/custom-infinite-query',
    method: 'get',
  };
  const keys = ['CUSTOM_INFINITE_QUERY'];

  it('fetch data correctly', async () => {
    const { result, waitFor } = renderHook(
      () => useCustomQuery({ config, keys }), { wrapper },
    );

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
