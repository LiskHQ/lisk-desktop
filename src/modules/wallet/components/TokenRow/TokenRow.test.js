import { renderWithRouter } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { mockTokensBalance } from '@token/fungible/__fixtures__';
import TokenRow from './TokenRow';

describe('TokenRow', () => {
  it('should display properly', async () => {
    const props = {
      data: mockTokensBalance.data[0],
    };
    renderWithRouter(TokenRow, props);

    const { symbol, name, availableBalance, lockedBalances } = props.data;
    const lockedBalance = lockedBalances.reduce((total, { amount }) => +amount + total, 0);

    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.queryByText(`${fromRawLsk(lockedBalance)} ${symbol.toUpperCase()}`));
    expect(screen.queryByText(`${fromRawLsk(availableBalance)}`));
    expect(screen.queryByText(`${fromRawLsk(+availableBalance + lockedBalance)}`));
    expect( screen.getByText(/~10\.00/g)).toBeTruthy();
    expect(screen.getByAltText(symbol)).toBeTruthy();
  });
});
