import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockDposConstants } from '../../__fixtures__/mockDposConstants';
import { useDposConstants } from './useDposConstants';

jest.useRealTimers();

describe('useDposConstants hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useDposConstants(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockDposConstants);
  });
});
