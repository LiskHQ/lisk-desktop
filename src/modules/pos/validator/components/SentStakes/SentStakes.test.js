import { screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { mockSentStakes } from '@pos/validator/__fixtures__';
import { mockTokensBalance } from '@token/fungible/__fixtures__/mockTokens';
import { truncateAddress } from '@wallet/utils/account';
import { renderWithRouter } from 'src/utils/testHelpers';
import SentStakes from './SentStakes';
import tableHeaderMap from './tableHeaderMap';
import { useSentVotes, usePosConstants } from '../../hooks/queries';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@token/fungible/hooks/queries');
jest.mock('src/modules/common/hooks');
jest.mock('../../hooks/queries');

describe('SentStakes', () => {
  const props = {
    history: { location: { search: '' } },
  };

  useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
  useSentVotes.mockReturnValue({ data: mockSentStakes });
  usePosConstants.mockReturnValue({ data: mockPosConstants });

  it('should display properly', async () => {
    renderWithRouter(SentStakes, props);

    expect(screen.getByText('Stakes')).toBeTruthy();
    expect(screen.getByText('/10 stakes available in your account')).toBeTruthy();
    expect(screen.getByText(10 - mockSentStakes.meta.total)).toBeTruthy();
    expect(screen.getAllByAltText('stakingQueueActive')).toBeTruthy();

    tableHeaderMap(jest.fn((t) => t)).forEach(({ title }) => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    mockSentStakes.data.votes.forEach(({ delegateAddress, amount, name }, index) => {
      expect(screen.getAllByText(name)[index]).toBeTruthy();
      expect(screen.getByText(truncateAddress(delegateAddress))).toBeTruthy();
      expect(
        screen.getAllByText(`${fromRawLsk(amount)} ${mockTokensBalance.data[0].symbol}`)[index]
      ).toBeTruthy();
      expect(screen.getAllByAltText('deleteIcon')[index]).toBeTruthy();
      expect(screen.getAllByAltText('edit')[index]).toBeTruthy();
    });
  });

  it('should not display staking and token', async () => {
    useSentVotes.mockReturnValue({});
    useTokensBalance.mockReturnValue({});

    renderWithRouter(SentStakes, props);

    mockSentStakes.data.votes.forEach(({ delegateAddress, amount, name }, index) => {
      expect(screen.queryAllByText(name)[index]).toBeFalsy();
      expect(screen.queryByText(truncateAddress(delegateAddress))).toBeFalsy();
      expect(screen.queryAllByText(`${fromRawLsk(amount)}`)[0]).toBeFalsy();
      expect(screen.queryAllByAltText('deleteIcon')[index]).toBeFalsy();
      expect(screen.queryAllByAltText('edit')[index]).toBeFalsy();
    });
  });
});
