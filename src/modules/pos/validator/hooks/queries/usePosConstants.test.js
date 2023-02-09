import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';
import { usePosConstants } from './usePosConstants';

jest.useRealTimers();

describe('usePosConstants hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => usePosConstants(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockPosConstants);
  });
});
