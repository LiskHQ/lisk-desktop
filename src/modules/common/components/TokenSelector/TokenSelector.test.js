import { fireEvent, screen, waitFor } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import { mockAppsTokens, mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { TokenSelector } from '.';

jest.mock('@token/fungible/hooks/queries');

useTokenBalances.mockReturnValue({ data: mockTokensBalance, isLoading: false });

describe('TokenSelector', () => {
  const props = {
    onChange: jest.fn(),
    styles: {},
    value: {
      availableBalance: 1000000000,
      symbol: 'LSK',
      ...mockAppsTokens.data[0],
    },
  };

  it('renders properly', async () => {
    smartRender(TokenSelector, props);

    expect(screen.getByText('Token')).toBeTruthy();
    expect(screen.getByText('Balance:')).toBeTruthy();
    expect(
      screen.getByText(
        `${convertFromBaseDenom(props.value.availableBalance, mockAppsTokens.data[0])} ${
          props.value.symbol
        }`
      )
    ).toBeTruthy();

    fireEvent.click(
      screen.getByText(
        `${convertFromBaseDenom(
          mockTokensBalance.data[0].availableBalance,
          mockAppsTokens.data[0]
        )} ${mockTokensBalance.data[0].symbol}`
      )
    );

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalled();
    });
  });

  it('should render no tokens in the dropdown options', async () => {
    useTokenBalances.mockReturnValue({ data: {}, isLoading: false });
    const { wrapper } = smartRender(TokenSelector, props);
    expect(screen.queryByText(mockTokensBalance.data[0].chainName)).toBeFalsy();

    useTokenBalances.mockReturnValue({ isLoading: false, isSuccess: true });
    wrapper.rerender(TokenSelector, props);

    expect(screen.queryByText(mockTokensBalance.data[0].chainName)).toBeFalsy();
  });
});
