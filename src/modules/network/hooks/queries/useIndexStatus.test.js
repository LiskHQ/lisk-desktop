import { renderHook } from '@testing-library/react-hooks';
import { mockIndexStatus } from '@network/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useIndexStatus } from '.';

jest.useRealTimers();

describe('useIndexStatus hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useIndexStatus(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockIndexStatus);
  });
});
