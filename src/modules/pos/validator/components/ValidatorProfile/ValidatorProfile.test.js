import React from 'react';
import numeral from 'numeral';
import { MemoryRouter } from 'react-router';
import { screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockBlocks } from '@block/__fixtures__';
import { mockValidators, mockReceivedStakes, mockSentStakes } from '@pos/validator/__fixtures__';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { mockAppsTokens } from '@token/fungible/__fixtures__'
import usePosToken from '@pos/validator/hooks/usePosToken';
import { fromRawLsk } from 'src/modules/token/fungible/utils/lsk';
import ValidatorProfile from './ValidatorProfile';
import { useValidators, useReceivedStakes, useSentStakes } from '../../hooks/queries';

const mockedCurrentAccount = mockSavedAccounts[0];
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

jest.mock('@block/hooks/queries/useBlocks');
jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('../../hooks/queries');
jest.mock('@pos/validator/hooks/usePosToken')


describe('Validator Profile', () => {
  let wrapper;

  const props = {
    history: {
      location: { search: '' },
      goBack: jest.fn(),
    },
  };

  beforeEach(() => {
    wrapper = renderWithRouter(ValidatorProfile, props);
  });

  useValidators.mockReturnValue({ data: mockValidators });
  useBlocks.mockReturnValue({ data: mockBlocks });
  useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });
  useSentStakes.mockReturnValue({ data: mockSentStakes });
  useReceivedStakes.mockReturnValue({ data: mockReceivedStakes });
  usePosToken.mockReturnValue({ token: mockAppsTokens.data[0]})

  it('Should render active validator profile details', () => {
    useSentStakes.mockReturnValue({
      data: {
        ...mockSentStakes,
        data: { ...mockReceivedStakes.data, stakes: mockReceivedStakes.data.stakers.slice(5, 7) },
      },
    });

    wrapper.rerender(
      <MemoryRouter initialEntries={['/']}>
        <ValidatorProfile {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('My validator profile')).toBeTruthy();
    expect(screen.getByText('Stake validator')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Performance')).toBeTruthy();
    expect(screen.getByText('Stakers')).toBeTruthy();

    expect(screen.getByText('Rank')).toBeTruthy();
    expect(screen.getAllByText('Round state')).toHaveLength(1);
    expect(screen.getByText('Validator weight')).toBeTruthy();
    expect(screen.getByText('Last generated block')).toBeTruthy();

    expect(screen.getByText('Last generated block height')).toBeTruthy();
    expect(screen.getByText('Blocks generated')).toBeTruthy();
    expect(screen.getByText('Rewards')).toBeTruthy();
    expect(screen.getByText('Consecutive missed blocks')).toBeTruthy();
    expect(screen.getByText('See breakdown')).toBeTruthy();

    expect(
      screen.getByText('This validator is among the first 101 validators by validator weight.')
    ).toBeTruthy();
    expect(
      screen.getByText('Active validators are select to generate blocks every round.')
    ).toBeTruthy();

    expect(screen.getByText(mockBlocks.meta.total)).toBeTruthy();
    expect(screen.getByText(mockValidators.data[0].lastGeneratedHeight)).toBeTruthy();
    expect(screen.getByText(mockValidators.data[0].consecutiveMissedBlocks)).toBeTruthy();
    expect(screen.getByText(mockValidators.data[0].rank)).toBeTruthy();
    expect(
      screen.getByText(
        `${numeral(fromRawLsk(mockValidators.data[0].validatorWeight)).format(
          '0,0.[0000000000000]'
        )} LSK`
      )
    ).toBeTruthy();
    expect(screen.getByTestId('date-timestamp')).toBeTruthy();
    expect(screen.getByTestId('addressFilter')).toBeTruthy();
    mockReceivedStakes.data.stakers.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it('Should render ineligible validator profile details', () => {
    useValidators.mockReturnValue({
      data: {
        ...mockValidators,
        data: mockValidators.data.map((data) => ({ ...data, status: 'ineligible' })),
      },
    });
    wrapper.rerender(
      <MemoryRouter>
        <ValidatorProfile {...props} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'The validator weight is below 1,000 LSK meaning that the validator is not eligible to generate.'
      )
    ).toBeTruthy();
  });

  it('Should render standby validator profile details', () => {
    useValidators.mockReturnValue({
      data: {
        ...mockValidators,
        data: mockValidators.data.map((data) => ({ ...data, status: 'standby' })),
      },
    });
    wrapper.rerender(
      <MemoryRouter>
        <ValidatorProfile {...props} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'The validator has at least 1,000 LSK validator weight, but is not among the top 101 by validator weight.'
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Standby validators can be chosen at random for one of two slots per round for generating a block.'
      )
    ).toBeTruthy();
  });

  it('Should render punished validator profile details', () => {
    useValidators.mockReturnValue({
      data: {
        ...mockValidators,
        data: mockValidators.data.map((data) => ({ ...data, status: 'punished' })),
      },
    });
    wrapper.rerender(
      <MemoryRouter>
        <ValidatorProfile {...props} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'The validator is temporarily punished and their validator weight is set to 0 due to a misbehavior.'
      )
    ).toBeTruthy();
    expect(screen.getByText('Details >')).toBeTruthy();
  });

  it('Should render banned validator profile details', () => {
    useValidators.mockReturnValue({
      data: {
        ...mockValidators,
        data: mockValidators.data.map((data) => ({ ...data, status: 'banned' })),
      },
    });
    wrapper.rerender(
      <MemoryRouter>
        <ValidatorProfile {...props} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'The validator is permanently banned from generating blocks due to repeated protocol violations or missing too many blocks.'
      )
    ).toBeTruthy();
  });

  it('Should render the stake validator button', () => {
    useValidators.mockReturnValue({
      data: {
        ...mockValidators,
        data: mockValidators.data.map((data) => ({ ...data, status: 'banned' })),
      },
    });
    useSentStakes.mockReturnValue({ data: {} });

    wrapper.rerender(
      <MemoryRouter>
        <ValidatorProfile {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Stake validator')).toBeTruthy();
  });

  it('Should render the stake validator button', () => {
    useValidators.mockReturnValue({
      data: {
        ...mockValidators,
        data: mockValidators.data.map((data) => ({ ...data, status: 'banned' })),
      },
    });
    useSentStakes.mockReturnValue({ data: {} });

    wrapper.rerender(
      <MemoryRouter>
        <ValidatorProfile {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Stake validator')).toBeTruthy();
  });

  it('Should render the stake validator button', () => {
    useValidators.mockReturnValue({
      data: {
        ...mockValidators,
        data: mockValidators.data.map((data) => ({ ...data, status: 'banned' })),
      },
    });
    useSentStakes.mockReturnValue({
      data: {
        ...mockReceivedStakes,
        data: {
          ...mockReceivedStakes.data,
          stakes: mockReceivedStakes.data.stakers.map((stake) => ({
            ...stake,
            validatorAddress: 'lskjq7jh2k7q332wgkz3bxogb8bj5zc3fcnb9ya53',
          })),
        },
      },
    });

    wrapper.rerender(
      <MemoryRouter>
        <ValidatorProfile {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Stake validator')).toBeTruthy();
  });
});
