import { act, renderHook } from '@testing-library/react-hooks';
import client from 'src/utils/api/client';
import { mockTransactions } from '@transaction/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { LIMIT as defaultLimit } from 'src/const/config';
import * as useCustomInfiniteQuerySpy from '@common/hooks/useCustomInfiniteQuery';
import { useCustomInfiniteQuery } from '@common/hooks';
import { useTransactions } from './useTransactions';

jest.useRealTimers();

describe('useTransactions hook', () => {
  const limit = mockTransactions.meta.total / 2;
  const config = { params: { limit } };

  it('fetches data correctly', async () => {
    const { result, waitFor } = renderHook(() => useTransactions({ config }), { wrapper });
    // Since placeholder data is used, then there's no initial data loading
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockTransactions.data.slice(0, limit),
      meta: {
        ...mockTransactions.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useTransactions({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockTransactions.data.slice(0, limit * 2),
      meta: {
        ...mockTransactions.meta,
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

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockTransactions.data.slice(0, defaultLimit),
      meta: {
        ...mockTransactions.meta,
        count: defaultLimit,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetches data without params correctly when client it created', async () => {
    jest.spyOn(client, 'create').mockImplementation(function () {
      this.socket = null;
    });
    client.create({
      http: '',
      ws: '',
    });
    const { result, waitFor } = renderHook(() => useTransactions(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockTransactions.data.slice(0, defaultLimit),
      meta: {
        ...mockTransactions.meta,
        count: defaultLimit,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should pass enabled === false to useCustomInfiniteQuery when enabled is set to false', async () => {
    jest.resetAllMocks();
    jest.spyOn(useCustomInfiniteQuerySpy, 'useCustomInfiniteQuery');
    const options = { enabled: false };
    renderHook(() => useTransactions({ options }), { wrapper });
    expect(useCustomInfiniteQuery).toBeCalledWith(
      expect.objectContaining({ options: { enabled: false } })
    );
  });

  it('should pass enabled === false to useCustomInfiniteQuery when enabled is set to false but getUpdate is set to true', async () => {
    jest.resetAllMocks();
    jest.spyOn(useCustomInfiniteQuerySpy, 'useCustomInfiniteQuery');
    const configuration = { options: { enabled: false }, getUpdate: true };
    renderHook(() => useTransactions(configuration), { wrapper });
    expect(useCustomInfiniteQuery).toBeCalledWith(
      expect.objectContaining({ options: { enabled: false } })
    );
  });
});
