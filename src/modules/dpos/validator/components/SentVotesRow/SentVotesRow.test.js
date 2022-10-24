import { renderWithRouter } from 'src/utils/testHelpers';
import { fireEvent, screen } from '@testing-library/react';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { truncateAddress } from '@wallet/utils/account';
import TokenRow from './SentVotesRow';
import { mockSentVotes } from '../../__fixtures__';

describe('SentVotesRow', () => {
  it('should display properly', async () => {
    const props = {
      data: mockSentVotes.data.votes[0],
      voteEdited: jest.fn(),
      dposToken: mockTokensBalance.data[0],
    };
    renderWithRouter(TokenRow, props);

    const { delegateAddress, amount, name } = props.data;

    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.getByText(truncateAddress(delegateAddress))).toBeTruthy();
    expect(screen.queryByText(`${fromRawLsk(amount)} ${props.dposToken.symbol}`));
    expect(screen.getByAltText('deleteIcon')).toBeTruthy();
    expect(screen.getByAltText('edit')).toBeTruthy();

    fireEvent.click(screen.getByAltText('deleteIcon'));

    expect(props.voteEdited).toHaveBeenCalledWith([
      {
        name,
        address: delegateAddress,
        amount: 0,
      },
    ]);
  });
});
