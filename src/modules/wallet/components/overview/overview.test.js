import { renderWithRouter } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { mockTokensBalance } from '../../../token/fungible/__fixtures__/mockTokens';
import Overview from './overview';

describe('Overview', () => {
  it('should display properly', async () => {
    const props = {
      data: mockTokensBalance.data[0],
    };
    renderWithRouter(Overview, props);

    const { symbol, name, availableBalance, lockedBalances } = props.data;
    const lockedBalance = lockedBalances.reduce((total, { amount }) => +amount + total, 0);

    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.queryByText(`${fromRawLsk(lockedBalance)} ${symbol.toUpperCase()}`));
    expect(screen.queryByText(`${fromRawLsk(availableBalance)}`));
    expect(screen.queryByText(`${fromRawLsk(+availableBalance + lockedBalance)}`));
    expect(screen.queryByTestId('fiat-balance').innerHTML.match(/~0\.05/g)).toBeTruthy();
    expect(screen.getByAltText(symbol)).toBeTruthy();
    expect(screen.getByAltText('arrowRightInactive')).toBeTruthy();
  });
});
