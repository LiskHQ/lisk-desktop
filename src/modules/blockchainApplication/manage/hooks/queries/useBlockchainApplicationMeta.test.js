import { renderHook, act } from '@testing-library/react-hooks';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useBlockchainApplicationMeta } from './useBlockchainApplicationMeta';

jest.useRealTimers();

describe('useBlockchainApplicationMeta hook', () => {
  const limit = 15;
  const config = { params: { limit } };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(
      () => useBlockchainApplicationMeta({ config }),
      { wrapper },
    );
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockBlockchainAppMeta.data.slice(0, limit),
      meta: {
        ...mockBlockchainAppMeta.meta,
        count: 1,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useBlockchainApplicationMeta(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = { ...mockBlockchainAppMeta };
    delete expectedResponse.links;

    expect(result.current.data).toEqual(expectedResponse);
  });

  it.skip('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(
      () => useBlockchainApplicationMeta({ config }),
      { wrapper },
    );
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    const expectedResponse = {
      data: mockBlockchainAppMeta.data.slice(0, limit * 2),
      meta: {
        ...mockBlockchainAppMeta.meta,
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
