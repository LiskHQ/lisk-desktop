import { renderHook } from '@testing-library/react-hooks';
import { mockValidators } from '@dpos/validator/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useForgersValidator } from './useForgersValidator';

jest.useRealTimers();

describe('useForgersValidator hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useForgersValidator(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockValidators);
  });
});
