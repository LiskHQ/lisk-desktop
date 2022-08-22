import { renderHook } from '@testing-library/react-hooks';
import { mockAuth } from '@auth/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useUserInfo } from './useUserInfo';

jest.useRealTimers();

describe('useUserInfo hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useUserInfo(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockAuth);
  });
});
