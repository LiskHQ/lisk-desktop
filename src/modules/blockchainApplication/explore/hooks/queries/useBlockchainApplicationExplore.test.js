import { renderHook, act } from '@testing-library/react-hooks';
import { mockBlockchainApp } from '@blockchainApplication/explore/__fixtures__/mockBlockchainApp';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import useBlockchainApplicationExplore  from './useBlockchainApplicationExplore';

jest.useRealTimers();

const expectedResponse = mockBlockchainApp.data.map(app => ({ ...app, isPinned: false }))

describe('useBlockchainApplicationExplore hook', () => {

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(
      () => useBlockchainApplicationExplore(),
      { wrapper },
    );
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(expectedResponse);
  });

  it('fetches data without params correctly', async () => {
    const { result, waitFor } = renderHook(() => useBlockchainApplicationExplore(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();

    expect(result.current.data).toEqual(expectedResponse);
  });

  it('should fetch next set of data correctly', async () => {
    const { result, waitFor } = renderHook(
      () => useBlockchainApplicationExplore(),
      { wrapper },
    );
    await waitFor(() => result.current.isFetched);
    act(() => {
      result.current.fetchNextPage();
    });
    await waitFor(() => result.current.isFetching);
    await waitFor(() => !result.current.isFetching);
    expect(result.current.data).toEqual(expectedResponse);
    expect(result.current.hasNextPage).toBeFalsy();
    act(() => {
      result.current.fetchNextPage();
    });
    expect(result.current.hasNextPage).toBeFalsy();
  });
});
