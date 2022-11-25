import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useLatestBlock } from './useLatestBlock';
import { mockBlocks } from '../../__fixtures__';

jest.useRealTimers();

describe('useLatestBlock hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useLatestBlock(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockBlocks.data[0]);
  });
});
