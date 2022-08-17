import { renderHook, act } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useSendTransaction } from './useSendTransaction';

jest.useRealTimers();

describe('useSendTransaction hook', () => {
  const { result, waitFor } = renderHook(() => useSendTransaction(), { wrapper });

  it('fetching data correctly', async () => {
    act(() => {
      result.current.mutate({});
    });
    await waitFor(() => result.current.isLoading);
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isSuccess);
    expect(result.current.isSuccess).toBeTruthy();
  });
});
