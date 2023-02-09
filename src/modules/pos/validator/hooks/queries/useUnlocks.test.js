import { renderHook, act } from '@testing-library/react-hooks';
import { mockUnlocks } from '@pos/validator/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockPosConstants } from '@pos/validator/__fixtures__/mockPosConstants';
import * as useCustomInfiniteQuerySpy from '@common/hooks/useCustomInfiniteQuery';
import { useCustomInfiniteQuery } from '@common/hooks';
import { usePosConstants, useUnlocks } from '.';

jest.useRealTimers();

jest.spyOn(useCustomInfiniteQuerySpy, 'useCustomInfiniteQuery');

jest.mock('@pos/validator/hooks/queries/usePosConstants');

describe('useUnlocks hook', () => {
  const limit = 15;
  const config = { params: { limit, address: 'lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg' } };

  usePosConstants.mockReturnValue({ data: mockPosConstants, isSuccess: true });

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useUnlocks({ config }), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: {
        ...mockUnlocks.data,
        pendingUnlocks: mockUnlocks.data.pendingUnlocks?.slice(0, limit),
      },
      meta: {
        ...mockUnlocks.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should call useCustomInfiniteQuery with enabled false if required params are missing', async () => {
    renderHook(() => useUnlocks(), { wrapper });
    expect(useCustomInfiniteQuery).toBeCalledWith(
      expect.objectContaining({ options: { enabled: false, select: expect.any(Function) } })
    );
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useUnlocks({ config }), { wrapper });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: {
        ...mockUnlocks.data,
        pendingUnlocks: mockUnlocks.data.pendingUnlocks?.slice(0, limit * 2),
      },
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
