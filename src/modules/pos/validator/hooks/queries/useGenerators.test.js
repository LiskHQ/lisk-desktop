import { renderHook, act } from '@testing-library/react-hooks';
import { mockGenerator } from '@pos/validator/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as defaultLimit } from 'src/const/config';
import { useGenerators } from './useGenerators';

jest.useRealTimers();

describe('useGenerators hook', () => {
  const limit = 52;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useGenerators({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockGenerator.data.slice(0, limit),
      meta: {
        ...mockGenerator.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useGenerators(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockGenerator.data.slice(0, defaultLimit),
      meta: {
        ...mockGenerator.meta,
        count: defaultLimit,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useGenerators({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockGenerator.data,
      meta: {
        ...mockGenerator.meta,
        count: limit,
        offset: limit,
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
