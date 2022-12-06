import { screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { mockSentVotes } from '@pos/validator/__fixtures__';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { truncateAddress } from '@wallet/utils/account';
import { renderWithRouter } from 'src/utils/testHelpers';
import SentVotes from './SentVotes';
import tableHeaderMap from './tableHeaderMap';
import { useSentVotes, useDposConstants } from '../../hooks/queries';
import { mockDposConstants } from '../../__fixtures__/mockDposConstants';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@token/fungible/hooks/queries');
jest.mock('src/modules/common/hooks');
jest.mock('../../hooks/queries');

describe('SentVotes', () => {
  const props = {
    history: { location: { search: '' } },
  };

  useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
  useSentVotes.mockReturnValue({ data: mockSentVotes });
  useDposConstants.mockReturnValue({ data: mockDposConstants });

  it('should display properly', async () => {
    renderWithRouter(SentVotes, props);

    expect(screen.getByText('Votes')).toBeTruthy();
    expect(screen.getByText('/10 votes available in your account')).toBeTruthy();
    expect(screen.getByText(10 - mockSentVotes.meta.total)).toBeTruthy();
    expect(screen.getAllByAltText('votingQueueActive')).toBeTruthy();

    tableHeaderMap(jest.fn((t) => t)).forEach(({ title }) => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    mockSentVotes.data.votes.forEach(({ delegateAddress, amount, name }, index) => {
      expect(screen.getAllByText(name)[index]).toBeTruthy();
      expect(screen.getByText(truncateAddress(delegateAddress))).toBeTruthy();
      expect(
        screen.getAllByText(`${fromRawLsk(amount)} ${mockTokensBalance.data[0].symbol}`)[index]
      ).toBeTruthy();
      expect(screen.getAllByAltText('deleteIcon')[index]).toBeTruthy();
      expect(screen.getAllByAltText('edit')[index]).toBeTruthy();
    });
  });

  it('should not display voting and token', async () => {
    useSentVotes.mockReturnValue({});
    useTokensBalance.mockReturnValue({});

    renderWithRouter(SentVotes, props);

    mockSentVotes.data.votes.forEach(({ delegateAddress, amount, name }, index) => {
      expect(screen.queryAllByText(name)[index]).toBeFalsy();
      expect(screen.queryByText(truncateAddress(delegateAddress))).toBeFalsy();
      expect(screen.queryAllByText(`${fromRawLsk(amount)}`)[0]).toBeFalsy();
      expect(screen.queryAllByAltText('deleteIcon')[index]).toBeFalsy();
      expect(screen.queryAllByAltText('edit')[index]).toBeFalsy();
    });
  });
});
