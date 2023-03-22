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
    useGetHasUserAccount.mockReturnValue({ data: { data: { exits: false } }, isLoading: true });
    const { result } = renderHook(
      () => useGetInitializationFees({ address }),
      { wrapper }
    );

    expect(result.current.data).toBe(null);
  });

  it('should not call token_getInitializationFees when user account is initialized', () => {
    useGetHasUserAccount.mockReturnValue({ data: { data: { exits: true } }, isLoading: true });
    const { result } = renderHook(
      () => useGetInitializationFees({ address }),
      { wrapper }
    );

    expect(result.current.data).toBe(null);
  });

  it('should call token_getInitializationFees when user account is not initialized', async () => {
    useGetHasUserAccount.mockReturnValue({
      data: { data: { exits: false } },
      isLoading: false,
    });
    const { result, waitFor } = renderHook(
      () => useGetInitializationFees({ address }),
      { wrapper }
    );

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual({
      data: { escrowAccount: '5000000', userAccount: '5000000' },
      meta: { endpoint: 'token_getInitializationFees', params: {} },
    });
  });
});
