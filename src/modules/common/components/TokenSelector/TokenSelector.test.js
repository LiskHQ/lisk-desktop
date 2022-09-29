import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
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
      availableBalance: 300000,
      symbol: 'LSK',
    },
  };

  it('renders properly', async () => {
    render(<TokenSelector {...props} />);

    expect(screen.getByText('Token')).toBeTruthy();
    expect(screen.getByText('Balance:')).toBeTruthy();
    expect(
      screen.getByText(`${fromRawLsk(props.value.availableBalance)} ${props.value.symbol}`)
    ).toBeTruthy();

    fireEvent.click(screen.getByText(mockTokensBalance.data[0].name));

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalled();
    });
  });

  it('should render no tokens in the dropdown options', async () => {
    useTokensBalance.mockReturnValue({ data: {}, isLoading: false });
    wrapper = render(<TokenSelector {...props} />);
    expect(screen.queryByText(mockTokensBalance.data[0].name)).toBeFalsy();

    useTokensBalance.mockReturnValue({ isLoading: false, isSuccess: true });
    wrapper.rerender(<TokenSelector {...props} />);

    expect(screen.queryByText(mockTokensBalance.data[0].name)).toBeFalsy();
  });
});
