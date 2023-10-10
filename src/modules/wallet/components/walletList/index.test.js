import { screen } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import { useTokensBalanceTop } from '@token/fungible/hooks/queries';
import { mockTokenBalancesTop } from '@token/fungible/__fixtures__';
import WalletTable from '.';

jest.mock('@token/fungible/hooks/queries/useTokensBalanceTop');

useTokensBalanceTop.mockReturnValue({
  isLoading: false,
  isSuccess: true,
  data: {
    data: { '0000000100000000': mockTokenBalancesTop.data.slice(0, 20) },
  },
});

const config = { renderType: 'render' };
const props = {
  tokenData: {
    data: [
      {
        tokenID: '0000000100000000',
        displayDenom: 'lsk',
        denomUnits: [{ denom: 'lsk', decimals: 8, aliases: ['Lisk'] }],
        symbol: 'LSK',
      },
    ],
  },
  tokenSummary: {
    data: {
      totalSupply: [
        {
          amount: '11036090880452566',
          tokenID: '0000000100000000',
        },
      ],
    },
  },
  filters: { tokenID: '0000000100000000' },
};

describe('WalletTable', () => {
  it('renders properly', () => {
    smartRender(WalletTable, props, config);

    expect(screen.getAllByTestId('wallets-row')).toHaveLength(20);
  });

  it('renders properly without accounts', () => {
    smartRender(WalletTable, { ...props, filters: {} }, config);

    expect(screen.queryAllByTestId('wallets-row')).toHaveLength(0);
  });
});
