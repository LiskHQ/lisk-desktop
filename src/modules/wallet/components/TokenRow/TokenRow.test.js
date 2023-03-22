import { renderWithRouter } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';
import numeral from 'numeral';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { mockAppsTokens, mockTokensBalance } from '@token/fungible/__fixtures__';
import TokenRow from './TokenRow';

describe('TokenRow', () => {
  it('should display properly', async () => {
    const props = {
      data: { ...mockTokensBalance.data[0], ...mockAppsTokens.data[0] },
    };
    renderWithRouter(TokenRow, props);

    const { symbol, chainName, availableBalance, lockedBalances } = props.data;
    const lockedBalance = lockedBalances.reduce((total, { amount }) => +amount + total, 0);

    expect(screen.getByText(chainName)).toBeTruthy();
    expect(
      screen.queryByText(
        `${numeral(convertFromBaseDenom(lockedBalance, mockAppsTokens.data[0])).format(
          '0,0.00'
        )} ${symbol.toUpperCase()}`
      )
    );
    expect(
      screen.queryByText(
        `${numeral(convertFromBaseDenom(availableBalance, mockAppsTokens.data[0])).format(
          '0,0.00'
        )}`
      )
    );
    expect(
      screen.queryByText(
        `${numeral(
          convertFromBaseDenom(+availableBalance + lockedBalance, mockAppsTokens.data[0])
        ).format('0')}`
      )
    );
    expect(screen.getByText(/~10\.00/g)).toBeTruthy();
    expect(screen.getByAltText(symbol)).toBeTruthy();
  });
});
