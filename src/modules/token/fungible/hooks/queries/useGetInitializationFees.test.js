import { renderHook } from '@testing-library/react-hooks';
import { useGetHasUserAccount } from '@token/fungible/hooks/queries';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useGetInitializationFees } from './useGetInitializationFees';

jest.useRealTimers();

beforeEach(() => jest.clearAllMocks());

jest.mock('@token/fungible/hooks/queries/useGetHasUserAccount');

describe('useGetInitializationFees hook', () => {
  const address = 'lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg';

  it('should not call the useInvoke query if useGetHasUserAccount is still loading', () => {
    useGetHasUserAccount.mockReturnValue({ data: { data: { exists: false } }, isLoading: true });
    const { result } = renderHook(() => useGetInitializationFees({ address }), { wrapper });

    expect(result.current.data).toBe(undefined);
  });

  it('should return isAccountInitialized true with initializationFees', async () => {
    useGetHasUserAccount.mockReturnValue({
      data: { data: { exists: true } },
      isLoading: false,
    });
    const { result, waitFor } = renderHook(() => useGetInitializationFees({ address }), {
      wrapper,
    });

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      isAccountInitialized: true,
      initializationFees: { userAccount: '5000000', escrowAccount: '5000000' },
    });
  });
});
