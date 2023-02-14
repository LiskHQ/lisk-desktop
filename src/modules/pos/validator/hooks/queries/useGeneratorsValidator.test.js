import { renderHook } from '@testing-library/react-hooks';
import { mockGenerators } from '@pos/validator/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useGeneratorsValidator } from './useGeneratorsValidator';

jest.useRealTimers();

describe('useGeneratorsValidator hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useGeneratorsValidator(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockGenerators);
  });
});
