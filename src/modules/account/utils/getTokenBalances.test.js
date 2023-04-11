import { renderHook } from '@testing-library/react-hooks';
import { mockTokensBalance } from '@token/fungible/__fixtures__';
import client from 'src/utils/api/client';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { getTokenBalances } from './getTokenBalances';

jest.useRealTimers();

describe('getTokenBalances hook', () => {
  const address = 'lskyau2yy4993jkbd7kxcsfsrarac8macbbs8saad';
  const config = {
    params: {
      address,
    },
  };

  it('returns empty array when account is uninitialized', async () => {
    jest.spyOn(client, 'call').mockReturnValue({ data: [] });

    const { result } = renderHook(() => getTokenBalances({ config }), { wrapper });
    const tokenBalances = await result.current;

    expect(tokenBalances).toEqual([]);
  });

  it('returns true if the right conditions are met', async () => {
    const mockTokenResponse = mockTokensBalance;
    jest.spyOn(client, 'call').mockReturnValue(mockTokenResponse);

    const { result } = renderHook(() => getTokenBalances({ config }), { wrapper });
    const tokenBalances = await result.current;

    expect(tokenBalances).toEqual(mockTokenResponse.data);
  });
});
