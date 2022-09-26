import React from 'react';
import { MemoryRouter } from 'react-router';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
import { renderWithRouter } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';
import { mockTokensBalance } from '../../../token/fungible/__fixtures__';
import TransactionEventsRow from './TokenCard';

describe('TokenCard', () => {
  let wrapper;

  it('should display properly', async () => {
    const { availableBalance, symbol } = mockTokensBalance.data[0];
    const props = {
      lockedBalance: 20000,
      url: 'test-url',
      availableBalance,
      symbol,
    };
    wrapper = renderWithRouter(TransactionEventsRow, props);

    expect(screen.queryAllByText(`${fromRawLsk(props.lockedBalance)} ${symbol.toUpperCase()}`));
    expect(screen.queryAllByText(`${fromRawLsk(availableBalance)} ${symbol.toUpperCase()}`));
    expect(screen.queryByTestId('fiat-balance').innerHTML.match(/~0\.05/g)).toBeTruthy();
    expect(screen.getByAltText(symbol)).toBeTruthy();

    wrapper.rerender(
      <MemoryRouter initialEntries={['/']}>
        <TransactionEventsRow {...props} symbol="EVT" />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('fiat-balance')).toBeFalsy();
    expect(screen.queryByTestId('locked-balance')).toBeFalsy();
  });
});
