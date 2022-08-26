import { renderHook, act } from '@testing-library/react-hooks';
import { LIMIT as defaultLimit } from 'src/const/config';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockCcm } from '../../__fixtures__';
import { useCcm } from './useCcm';

jest.useRealTimers();

describe('useCcm hook', () => {
  const limit = 5;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useCcm({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockCcm.data.slice(0, limit),
      meta: {
        ...mockCcm.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetching data correctly without any options/config', async () => {
    const { result, waitFor } = renderHook(() => useCcm(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual({
      ...mockCcm,
      meta: {
        ...mockCcm.meta,
        count: defaultLimit,
      },
    });
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useCcm({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockCcm.data.slice(0, limit * 2),
      meta: {
        ...mockCcm.meta,
        count: limit,
        offset: limit,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
    expect(result.current.hasNextPage).toBeTruthy();
  });
});
