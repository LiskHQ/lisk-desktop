import React from 'react';
import numeral from 'numeral';
import { MemoryRouter } from 'react-router';
import { screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockBlocks } from '@block/__fixtures__';
import { mockDelegates, mockReceivedVotes, mockSentVotes } from '@dpos/validator/__fixtures__';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
import DelegateProfile from './delegateProfile';
import { useDelegates, useReceivedVotes, useSentVotes } from '../../hooks/queries';

const mockedCurrentAccount = mockSavedAccounts[0];
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@block/hooks/queries/useBlocks');
jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('../../hooks/queries');

describe('Delegate Profile', () => {
  let wrapper;

  const props = {
    history: {
      location: { search: '' },
      goBack: jest.fn(),
    },
  };

  beforeEach(() => {
    wrapper = renderWithRouter(DelegateProfile, props);
  });

  useDelegates.mockReturnValue({ data: mockDelegates });
  useBlocks.mockReturnValue({ data: mockBlocks });
  useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });
  useSentVotes.mockReturnValue({ data: mockSentVotes });
  useReceivedVotes.mockReturnValue({ data: mockReceivedVotes });

  it('Should render active delegate profile details', () => {
    useSentVotes.mockReturnValue({
      data: {
        ...mockSentVotes,
        data: { ...mockReceivedVotes.data, votes: mockReceivedVotes.data.votes.slice(5, 7) },
      },
    });

    wrapper.rerender(
      <MemoryRouter initialEntries={['/']}>
        <DelegateProfile {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('My delegate profile')).toBeTruthy();
    expect(screen.getByText('Vote delegate')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Performance')).toBeTruthy();
    expect(screen.getByText('Voters')).toBeTruthy();

    expect(screen.getByText('Rank')).toBeTruthy();
    expect(screen.getAllByText('Status')).toHaveLength(2);
    expect(screen.getByText('Delegate weight')).toBeTruthy();
    expect(screen.getByText('Last block forged')).toBeTruthy();

    expect(screen.getByText('Last forged block')).toBeTruthy();
    expect(screen.getByText('Forged blocks')).toBeTruthy();
    expect(screen.getByText('Rewards (LSK)')).toBeTruthy();
    expect(screen.getByText('Consecutive missed blocks')).toBeTruthy();

    expect(
      screen.getByText('This delegate is among the first 101 delegates by delegate weight.')
    ).toBeTruthy();
    expect(
      screen.getByText('Active delegates are select to generate blocks every round.')
    ).toBeTruthy();

    expect(screen.getByText(mockBlocks.meta.total)).toBeTruthy();
    expect(screen.getByText(mockDelegates.data[0].lastGeneratedHeight)).toBeTruthy();
    expect(screen.getByText(mockDelegates.data[0].consecutiveMissedBlocks)).toBeTruthy();
    expect(screen.getByText(mockDelegates.data[0].rank)).toBeTruthy();
    expect(
      screen.getByText(
        `${numeral(fromRawLsk(mockDelegates.data[0].voteWeight)).format('0,0.[0000000000000]')} LSK`
      )
    ).toBeTruthy();
    expect(screen.getByTestId('date-timestamp')).toBeTruthy();

    expect(screen.getByText('Rank')).toBeTruthy();
    expect(screen.getByTestId('addressFilter')).toBeTruthy();
    mockReceivedVotes.data.votes.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it('Should render ineligible delegate profile details', () => {
    useDelegates.mockReturnValue({
      data: {
        ...mockDelegates,
        data: mockDelegates.data.map((data) => ({ ...data, status: 'ineligible' })),
      },
    });
    wrapper.rerender(
      <MemoryRouter>
        <DelegateProfile {...props} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'The delegate weight is below 1,000 LSK meaning that the delegate is not eligible to forge.'
      )
    ).toBeTruthy();
  });

  it('Should render stanby delegate profile details', () => {
    useDelegates.mockReturnValue({
      data: {
        ...mockDelegates,
        data: mockDelegates.data.map((data) => ({ ...data, status: 'standby' })),
      },
    });
    wrapper.rerender(
      <MemoryRouter>
        <DelegateProfile {...props} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'The delegate has at least 1,000 LSK delegate weight, but is not among the top 101 by delegate weight.'
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Standby delegates can be chosen at random for one of two slots per round for generating a block.'
      )
    ).toBeTruthy();
  });

  it('Should render punished delegate profile details', () => {
    useDelegates.mockReturnValue({
      data: {
        ...mockDelegates,
        data: mockDelegates.data.map((data) => ({ ...data, status: 'punished' })),
      },
    });
    wrapper.rerender(
      <MemoryRouter>
        <DelegateProfile {...props} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'The delegate is temporarily punished and their delegate weight is set to 0 due to a misbehavior.'
      )
    ).toBeTruthy();
    expect(screen.getByText('Details >')).toBeTruthy();
  });

  it('Should render banned delegate profile details', () => {
    useDelegates.mockReturnValue({
      data: {
        ...mockDelegates,
        data: mockDelegates.data.map((data) => ({ ...data, status: 'banned' })),
      },
    });
    wrapper.rerender(
      <MemoryRouter>
        <DelegateProfile {...props} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'The delegate is permanently banned from generating blocks due to repeated protocol violations or missing too many blocks.'
      )
    ).toBeTruthy();
  });

  it('Should render the vote delegate button', () => {
    useDelegates.mockReturnValue({
      data: {
        ...mockDelegates,
        data: mockDelegates.data.map((data) => ({ ...data, status: 'banned' })),
      },
    });
    useSentVotes.mockReturnValue({ data: {} });

    wrapper.rerender(
      <MemoryRouter>
        <DelegateProfile {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Vote delegate')).toBeTruthy();
  });

  it('Should render the vote delegate button', () => {
    useDelegates.mockReturnValue({
      data: {
        ...mockDelegates,
        data: mockDelegates.data.map((data) => ({ ...data, status: 'banned' })),
      },
    });
    useSentVotes.mockReturnValue({ data: {} });

    wrapper.rerender(
      <MemoryRouter>
        <DelegateProfile {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Vote delegate')).toBeTruthy();
  });

  it('Should render the vote delegate button', () => {
    useDelegates.mockReturnValue({
      data: {
        ...mockDelegates,
        data: mockDelegates.data.map((data) => ({ ...data, status: 'banned' })),
      },
    });
    useSentVotes.mockReturnValue({
      data: {
        ...mockReceivedVotes,
        data: {
          ...mockReceivedVotes.data,
          votes: mockReceivedVotes.data.votes.map((vote) => ({
            ...vote,
            delegateAddress: 'lskjq7jh2k7q332wgkz3bxogb8bj5zc3fcnb9ya53',
          })),
        },
      },
    });

    wrapper.rerender(
      <MemoryRouter>
        <DelegateProfile {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Vote delegate')).toBeTruthy();
  });
});
