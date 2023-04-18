import React from 'react';
import { MemoryRouter } from 'react-router';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { renderWithRouter } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';
import useFiatRates from 'src/modules/common/hooks/useFiatRates';
import { mockAppsTokens, mockTokensBalance } from '@token/fungible/__fixtures__';
import TransactionEventsRow from './TokenCard';

jest.mock('src/modules/common/hooks/useFiatRates');

describe('TokenCard', () => {
  let wrapper;
  const { availableBalance, symbol } = mockTokensBalance.data[0];
  const props = {
    token: { ...mockAppsTokens.data[0], ...mockTokensBalance.data[0] },
  };

  useFiatRates.mockReturnValue({ LSK: { USD: 1, EUR: 1 } });

  it('should display properly ', async () => {
    wrapper = renderWithRouter(TransactionEventsRow, props);

    expect(
      screen.queryAllByText(
        `${convertFromBaseDenom(
          props.lockedBalance,
          mockAppsTokens.data[0]
        )} ${symbol.toUpperCase()}`
      )
    );
    expect(
      screen.queryAllByText(
        `${convertFromBaseDenom(availableBalance, mockAppsTokens.data[0])} ${symbol.toUpperCase()}`
      )
    );
    expect(screen.getByText(/~10\.00/g)).toBeTruthy();
    expect(screen.getByAltText(symbol)).toBeTruthy();

    const newProps = {
      ...props,
      token: { ...mockTokensBalance.data[0], ...mockAppsTokens.data[2] },
    };
    wrapper.rerender(
      <MemoryRouter initialEntries={['/']}>
        <TransactionEventsRow {...newProps} />
      </MemoryRouter>
    );

    expect(wrapper.container.querySelector('.fiatBalance')).toBe(null);
    expect(screen.getByAltText('lock')).toBeTruthy();
  });

  it('should not show locked balance link if locked balance is 0 or undefined', async () => {
    const newProps = {
      ...props,
      token: {
        ...mockAppsTokens.data[0],
        ...{
          ...mockTokensBalance.data[0],
          lockedBalances: [],
        },
      },
    };
    renderWithRouter(TransactionEventsRow, newProps);
    expect(() => screen.getByAltText('lock')).toThrow();

    renderWithRouter(TransactionEventsRow, {
      ...props,
      token: {
        ...mockAppsTokens.data[0],
        ...{
          ...mockTokensBalance.data[0],
          lockedBalances: undefined,
        },
      },
    });
    expect(() => screen.getByAltText('lock')).toThrow();
  });
});
