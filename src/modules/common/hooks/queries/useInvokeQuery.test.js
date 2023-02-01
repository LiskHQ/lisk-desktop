import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockInvoke } from '../../__fixtures__/mockInvoke';
import { useInvokeQuery } from './useInvokeQuery';

jest.useRealTimers();

describe('useUserInfo hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useInvokeQuery({}), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockInvoke);
  });
});
