import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '@auth/hooks/queries';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { mockTokensBalance } from 'src/modules/token/fungible/__fixtures__';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import useCheckInitializedAccount from './useCheckInitializedAccount';

jest.useRealTimers();

jest.mock('@auth/hooks/queries/useAuth');
jest.mock('@token/fungible/hooks/queries/useTokensBalance');

describe('useCheckInitializedAccount hook', () => {
  const config = {
    params: {
      address: 'lskyau2yy4993jkbd7kxcsfsrarac8macbbs8saad',
    },
  };
  let hookResult;

  it('returns false by default', async () => {
    const mockTokenResponse = { data: undefined, isLoading: true, isSuccess: false };
    const mockAuthResponse = { data: undefined, isLoading: true, isSuccess: false };
    useTokensBalance.mockReturnValue(mockTokenResponse);
    useAuth.mockReturnValue(mockAuthResponse);

    hookResult = renderHook(() => useCheckInitializedAccount({ config }), { wrapper });
    const { result } = hookResult;

    expect(result.current).toBeFalsy();
  });

  it('returns false if account is uninitialized', async () => {
    const mockUninitializedTokenBalance = {
      data: [
        {
          tokenID: '0400000000000000',
          availableBalance: '0',
          lockedBalances: [],
        },
      ],
      meta: {
        address: 'lskyau2yy4993jkbd7kxcsfsrarac8macbbs8saad',
        count: 1,
        offset: 0,
        total: 1,
      },
    };
    const mockTokenResponse = {
      data: mockUninitializedTokenBalance,
      isLoading: false,
      isSuccess: true,
    };
    const mockAuthResponse = { data: mockAuth, isLoading: false, isSuccess: true };
    useTokensBalance.mockReturnValue(mockTokenResponse);
    useAuth.mockReturnValue(mockAuthResponse);

    hookResult = renderHook(() => useCheckInitializedAccount({ config }), { wrapper });
    const { result } = hookResult;

    expect(result.current).toBeFalsy();
  });

  it('returns true if the right conditions are met', async () => {
    const mockTokenResponse = { data: mockTokensBalance, isLoading: false, isSuccess: true };
    const mockAuthResponse = { data: mockAuth, isLoading: false, isSuccess: true };
    useTokensBalance.mockReturnValue(mockTokenResponse);
    useAuth.mockReturnValue(mockAuthResponse);

    hookResult = renderHook(() => useCheckInitializedAccount({ config }), { wrapper });
    const { result } = hookResult;

    expect(result.current).toBeTruthy();
  });
});
