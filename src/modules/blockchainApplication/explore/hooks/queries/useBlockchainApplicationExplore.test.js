import { renderHook, act } from '@testing-library/react-hooks';
import { mockBlockchainApp } from '@blockchainApplication/explore/__fixtures__/mockBlockchainApp';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useBlockchainApplicationExplore } from './useBlockchainApplicationExplore';

jest.useRealTimers();

describe('useBlockchainApplicationExplore hook', () => {
  const limit = 15;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useBlockchainApplicationExplore({ config }), {
      wrapper,
    });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockBlockchainApp.data.slice(0, limit),
      meta: {
        ...mockBlockchainApp.meta,
        count: 2,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useBlockchainApplicationExplore(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockBlockchainApp.data,
      meta: {
        ...mockBlockchainApp.meta,
        count: mockBlockchainApp.data.length,
        offset: 0,
      },
    };

    expect(result.current.data).toEqual(expectedResponse);
  });

  it.skip('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(() => useBlockchainApplicationExplore({ config }), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockBlockchainApp.data.slice(0, limit * 2),
      meta: {
        ...mockBlockchainApp.meta,
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
