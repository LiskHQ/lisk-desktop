import { renderHook, act } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useSendTransaction } from './useSendTransaction';

jest.useRealTimers();

describe('useSendTransaction hook', () => {
  // @Todo: this should be reinstated by PR-4486
  it.skip('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useSendTransaction(), { wrapper });
    act(() => {
      result.current.mutate();
    });
    await waitFor(() => !result.current.isLoading);
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isSuccess);
    expect(result.current.isSuccess).toBeTruthy();
  });
});
