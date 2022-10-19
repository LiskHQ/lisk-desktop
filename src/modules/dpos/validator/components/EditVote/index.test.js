import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { fromRawLsk, toRawLsk } from '@token/fungible/utils/lsk';
import numeral from 'numeral';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockBlocks } from '@block/__fixtures__';
import { useAuth } from '@auth/hooks/queries';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { mockDelegates, mockSentVotes } from '@dpos/validator/__fixtures__';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import { mockTokensBalance } from 'src/modules/token/fungible/__fixtures__';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import EditVote from './index';
import { useDelegates, useSentVotes } from '../../hooks/queries';

jest.mock('@transaction/api', () => ({
  getTransactionFee: jest.fn().mockImplementation(() => Promise.resolve({ value: '0.046' })),
}));

const mockedCurrentAccount = mockSavedAccounts[0];
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@block/hooks/queries/useBlocks');
jest.mock('../../hooks/queries');
jest.mock('@token/fungible/hooks/queries');
jest.mock('@auth/hooks/queries');

describe('EditVote', () => {
  let wrapper;
  const props = {
    history: { location: { search: `?address=${mockDelegates.data[0].address}` }, push: jest.fn() },
    voteEdited: jest.fn(),
    network: {},
    voting: {},
    votesRetrieved: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useDelegates.mockReturnValue({ data: mockDelegates });
    useBlocks.mockReturnValue({ data: mockBlocks });
    useSentVotes.mockReturnValue({ data: mockSentVotes });
    useAuth.mockReturnValue({ data: mockAuth });
    useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
    wrapper = renderWithRouter(EditVote, props);
  });

  it('should properly render add vote form', () => {
    const delegate = mockDelegates.data[0];
    const token = mockTokensBalance.data[0];
    const address = 'lsk6wrjbs66uo9eoqr4t86afvd4yym6ovj4afunvh';

    wrapper.rerender(
      <MemoryRouter initialEntries={['/']}>
        <EditVote
          {...props}
          history={{
            ...props.history,
            location: { search: `?address=${address}` },
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Add to voting queue')).toBeTruthy();
    expect(screen.getByText(address)).toBeTruthy();
    expect(screen.getByText(delegate.name)).toBeTruthy();
    expect(screen.getByTestId(`wallet-visual-${address}`)).toBeTruthy();
    expect(screen.getByText('Available balance:')).toBeTruthy();
    expect(
      screen.getByText(
        `${numeral(fromRawLsk(token.availableBalance)).format('0,0.[0000000000000]')} ${
          token.symbol
        }`
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Insert a vote amount for this delegate. Your new vote will be added to the voting queue.'
      )
    ).toBeTruthy();
    expect(screen.getByText('Vote amount ({{symbol}})')).toBeTruthy();
  });

  it('should add vote to the votes queue', async () => {
    const delegate = mockDelegates.data[0];
    const votingField = screen.getByTestId('vote');

    fireEvent.change(votingField, { target: { value: 20 } });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(props.voteEdited).toHaveBeenCalledWith([
        {
          address: delegate.address,
          name: delegate.name,
          amount: toRawLsk(20),
        },
      ]);
    });
  });

  it('should render the confirmation modal and go back to the voting form', () => {
    const delegate = mockDelegates.data[0];
    const token = mockTokensBalance.data[0];
    const address = 'lsk6wrjbs66uo9eoqr4t86afvd4yym6ovj4afunvh';

    wrapper.rerender(
      <MemoryRouter initialEntries={['/']}>
        <EditVote
          {...props}
          history={{
            ...props.history,
            location: { search: `?address=${address}` },
          }}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Confirm'));
    expect(screen.getByText('Vote added')).toBeTruthy();
    expect(screen.getByText('Your vote has been added to your voting queue')).toBeTruthy();

    fireEvent.click(screen.getByText('Continue voting'));
    expect(screen.getByText('Add to voting queue')).toBeTruthy();
    expect(screen.getByText(address)).toBeTruthy();
    expect(screen.getByText(delegate.name)).toBeTruthy();
    expect(screen.getByTestId(`wallet-visual-${address}`)).toBeTruthy();
    expect(screen.getByText('Available balance:')).toBeTruthy();
    expect(
      screen.getByText(
        `${numeral(fromRawLsk(token.availableBalance)).format('0,0.[0000000000000]')} ${
          token.symbol
        }`
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Insert a vote amount for this delegate. Your new vote will be added to the voting queue.'
      )
    ).toBeTruthy();
    expect(screen.getByText('Vote amount ({{symbol}})')).toBeTruthy();
  });

  it('should render the confirmation modal and proceed to the voting queue', async () => {
    const address = 'lsk6wrjbs66uo9eoqr4t86afvd4yym6ovj4afunvh';

    wrapper.rerender(
      <MemoryRouter initialEntries={['/']}>
        <EditVote
          {...props}
          history={{
            ...props.history,
            location: { search: `?address=${address}` },
          }}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('Go to the voting queue'));

    expect(props.history.push).toHaveBeenCalled();
  });

  it('should render the edit vote modal', async () => {
    const delegate = mockDelegates.data[0];

    useSentVotes.mockReturnValue({
      data: {
        ...mockSentVotes,
        data: {
          ...mockSentVotes.data,
          votes: mockSentVotes.data.votes.map((vote, index) =>
            index === 0 ? { ...vote, delegateAddress: delegate.address } : vote
          ),
        },
      },
    });

    wrapper.rerender(
      <MemoryRouter initialEntries={['/']}>
        <EditVote {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Edit Vote')).toBeTruthy();
    expect(
      screen.getByText('After changing your vote amount, it will be added to the voting queue.')
    ).toBeTruthy();
    expect(screen.getByText('Vote amount ({{symbol}})')).toBeTruthy();

    const votingField = screen.getByTestId('vote');

    fireEvent.change(votingField, { target: { value: 20 } });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(props.voteEdited).toHaveBeenCalledWith([
        {
          address: delegate.address,
          name: delegate.name,
          amount: toRawLsk(20),
        },
      ]);
    });

    expect(props.history.push).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Remove vote'));

    await waitFor(() => {
      expect(props.voteEdited).toHaveBeenCalledWith([
        {
          address: delegate.address,
          name: delegate.name,
          amount: 0,
        },
      ]);
    });
  });
});
