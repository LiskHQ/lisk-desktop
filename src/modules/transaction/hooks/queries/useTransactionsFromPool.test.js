import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useTransactionsFromPool } from './useTransactionsFromPool';

jest.useRealTimers();

beforeEach(() => jest.clearAllMocks());

describe('useTransactionsFromPool hook', () => {
  it('should return status from request', async () => {
    const { result, waitFor } = renderHook(() => useTransactionsFromPool(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
  });
});
