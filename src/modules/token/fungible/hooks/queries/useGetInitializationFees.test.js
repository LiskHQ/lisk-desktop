import { useAuth } from '@auth/hooks/queries';
import { mockAuth } from '@auth/__fixtures__';
import { renderHook } from '@testing-library/react-hooks';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { useGetInitializationFees } from './useGetInitializationFees';

jest.useRealTimers();

jest.mock('@auth/hooks/queries/useAuth');
jest.mock('@token/fungible/hooks/queries');

beforeEach(() => jest.clearAllMocks());

describe('useGetInitializationFees hook', () => {
  const address = 'lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg';

  it('should not call the useInvoke query if token is still loading', () => {
    useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: true });
    useAuth.mockReturnValue({ data: mockAuth, isLoading: false });
    const { result } = renderHook(
      () => useGetInitializationFees({ address }),
      { wrapper }
    );

    expect(result.current.data).toBe(null);
  });

  it('does not call the useInvoke query if auth is still loading', () => {
    useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
    useAuth.mockReturnValue({ data: mockAuth, isLoading: true });
    const { result } = renderHook(
      () => useGetInitializationFees({ address }),
      { wrapper }
    );

    expect(result.current.data).toBe(null);
  });

  it('does not call the useInvoke query if both auth and token is still loading', () => {
    useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: true });
    useAuth.mockReturnValue({ data: mockAuth, isLoading: true });
    const { result } = renderHook(
      () => useGetInitializationFees({ address }),
      { wrapper }
    );

    expect(result.current.data).toBe(null);
  });

  it('does not call the useInvoke query if account is not initialized', async () => {
    useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
    useAuth.mockReturnValue({
      data: mockAuth,
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

  it('does not call the useInvoke query if account is not initialized', () => {
    useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
    useAuth.mockReturnValue({
      data: { ...mockAuth, data: { ...mockAuth.data, nonce: '2' } },
      isLoading: false,
    });
    const { result } = renderHook(
      () => useGetInitializationFees({ address }),
      { wrapper }
    );

    expect(result.current.data).toBe(null);
  });
});
