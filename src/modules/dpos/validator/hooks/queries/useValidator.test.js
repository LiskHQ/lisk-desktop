import { renderHook } from '@testing-library/react-hooks';
import { mockValidators } from '@dpos/validator/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useValidator } from './useValidator';

jest.useRealTimers();

describe('useValidator hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useValidator(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockValidators);
  });
});
