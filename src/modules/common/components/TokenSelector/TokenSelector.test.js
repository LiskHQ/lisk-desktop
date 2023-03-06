import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockAppsTokens, mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { convertFromBaseDenom } from '@token/fungible/utils/lsk';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { TokenSelector } from '.';

jest.mock('@token/fungible/hooks/queries');

useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });

describe('TokenSelector', () => {
  let wrapper;
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
    render(<TokenSelector {...props} />);

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
        `${convertFromBaseDenom(mockTokensBalance.data[0].availableBalance, mockAppsTokens.data[0])} ${
          mockTokensBalance.data[0].symbol
        }`
      )
    );

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalled();
    });
  });

  it('should render no tokens in the dropdown options', async () => {
    useTokensBalance.mockReturnValue({ data: {}, isLoading: false });
    wrapper = render(<TokenSelector {...props} />);
    expect(screen.queryByText(mockTokensBalance.data[0].chainName)).toBeFalsy();

    useTokensBalance.mockReturnValue({ isLoading: false, isSuccess: true });
    wrapper.rerender(<TokenSelector {...props} />);

    expect(screen.queryByText(mockTokensBalance.data[0].chainName)).toBeFalsy();
  });
});
