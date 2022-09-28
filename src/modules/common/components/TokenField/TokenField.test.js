import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { TokenField } from '.';

jest.mock('@token/fungible/hooks/queries');

useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });

describe('TokenField', () => {
  const props = {
    onChange: jest.fn(),
    styles: {},
    value: {
      availableBalance: 300000,
      symbol: 'LSK',
    },
  };

  it('renders properly', async () => {
    render(<TokenField {...props} />);

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
});
