import { renderWithRouter } from 'src/utils/testHelpers';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockTokensBalance } from 'src/modules/token/fungible/__fixtures__';
import TokenRow from './StakeSuccessfulModal';

describe('StakeSuccessfulModal', () => {
  it('should display properly', async () => {
    const props = {
      history: {
        push: jest.fn(),
      },
      statusMessage: {
        message: 'test message',
      },
      posToken: mockTokensBalance.data[0],
    };
    renderWithRouter(TokenRow, props);

    expect(screen.getByText('Staking confirmed')).toBeTruthy();
    expect(screen.getByText('test message')).toBeTruthy();

    fireEvent.click(screen.getByText('Show all your stakes'));

    await waitFor(() => {
      expect(props.history.push).toHaveBeenCalledWith('/validators/profile/stakes');
    });
  });
});
