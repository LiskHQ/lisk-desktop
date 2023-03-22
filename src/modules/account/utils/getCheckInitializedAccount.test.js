import { renderHook } from '@testing-library/react-hooks';
import { mockTokensBalance } from '@token/fungible/__fixtures__';
import { mockAuth } from '@auth/__fixtures__';
import client from 'src/utils/api/client';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { getCheckInitializedAccount } from './getCheckInitializedAccount';

jest.useRealTimers();

jest.mock('@auth/hooks/queries/useAuth');
jest.mock('@token/fungible/hooks/queries/useTokensBalance');

describe('getCheckInitializedAccount hook', () => {
  const config = {
    params: {
      address: 'lskyau2yy4993jkbd7kxcsfsrarac8macbbs8saad',
    },
  };
  let hookResult;

  it('returns false by default', async () => {
    const mockTokenResponse = undefined;
    const mockAuthResponse = undefined;
    jest.spyOn(client, 'call').mockReturnValue(mockAuthResponse);
    jest.spyOn(client, 'call').mockReturnValue(mockTokenResponse);

    hookResult = renderHook(() => getCheckInitializedAccount({ config }), { wrapper });
    const { result } = hookResult;

    await expect(result.current).resolves.toBeFalsy();
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
    const mockTokenResponse = mockUninitializedTokenBalance;
    const mockAuthResponse = { data: mockAuth };
    jest.spyOn(client, 'call').mockReturnValue(mockAuthResponse);
    jest.spyOn(client, 'call').mockReturnValue(mockTokenResponse);

    hookResult = renderHook(() => getCheckInitializedAccount({ config }), { wrapper });
    const { result } = hookResult;

    await expect(result.current).resolves.toBeFalsy();
  });

  it('returns true if the right conditions are met', async () => {
    const mockTokenResponse = mockTokensBalance;
    const mockAuthResponse = mockAuth;
    jest.spyOn(client, 'call').mockReturnValue(mockAuthResponse);
    jest.spyOn(client, 'call').mockReturnValue(mockTokenResponse);

    hookResult = renderHook(() => getCheckInitializedAccount({ config }), { wrapper });
    const { result } = hookResult;

    expect(result.current).toBeTruthy();
  });
});
