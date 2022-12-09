import { renderWithRouter } from 'src/utils/testHelpers';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockTokensBalance } from 'src/modules/token/fungible/__fixtures__';
import TokenRow from './VoteSuccessfulModal';

describe('VoteSuccessfulModal', () => {
  it('should display properly', async () => {
    const props = {
      history: {
        push: jest.fn(),
      },
      statusMessage: {
        message: 'test message',
      },
      dposToken: mockTokensBalance.data[0],
    };
    renderWithRouter(TokenRow, props);

    expect(screen.getByText('Voting confirmation')).toBeTruthy();
    expect(screen.getByText('Vote(s) has been submitted')).toBeTruthy();
    expect(screen.getByText('test message')).toBeTruthy();

    fireEvent.click(screen.getByText('Back to delegates'));

    await waitFor(() => {
      expect(props.history.push).toHaveBeenCalledWith('/validators');
    });
  });
});
