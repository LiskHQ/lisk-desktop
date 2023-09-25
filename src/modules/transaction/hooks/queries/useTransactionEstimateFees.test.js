import { renderHook } from '@testing-library/react-hooks';
import { mockTransactionFees } from '@transaction/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useTransactionEstimateFees } from '.';

jest.useRealTimers();

describe('useTransactionFees hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useTransactionEstimateFees(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockTransactionFees);
  });
});
