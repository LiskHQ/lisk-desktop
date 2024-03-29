import React from 'react';
import numeral from 'numeral';
import { MemoryRouter } from 'react-router';
import { screen } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockBlocks } from '@block/__fixtures__';
import { mockReceivedStakes, mockSentStakes, mockValidators } from '@pos/validator/__fixtures__';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { mockAppsTokens, mockTokensBalance } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import ValidatorProfile from './ValidatorProfile';
import { useReceivedStakes, useSentStakes, useValidators } from '../../hooks/queries';

const mockedCurrentAccount = mockSavedAccounts[0];
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));
jest.mock('@token/fungible/hooks/queries/useTokenBalances');
jest.mock('@block/hooks/queries/useBlocks');
jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('../../hooks/queries', () => ({
  ...jest.requireActual('../../hooks/queries'),
  useValidators: jest.fn(),
  useReceivedStakes: jest.fn(),
  useSentStakes: jest.fn(),
}));
jest.mock('@pos/validator/hooks/usePosToken');

const mockSetApplication = jest.fn();
useCurrentApplication.mockReturnValue([mockManagedApplications[1], mockSetApplication]);

describe('Validator Profile', () => {
  let wrapper;

  const props = {
    history: {
      location: { search: '' },
      goBack: jest.fn(),
    },
  };
  let queryClient;

  beforeEach(() => {
    wrapper = renderWithRouterAndQueryClient(ValidatorProfile, props);
    queryClient = new QueryClient();
  });

  useValidators.mockReturnValue({ data: mockValidators });
  useBlocks.mockReturnValue({ data: mockBlocks });
  useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });
  useSentStakes.mockReturnValue({ data: mockSentStakes });
  useReceivedStakes.mockReturnValue({ data: mockReceivedStakes });
  usePosToken.mockReturnValue({ token: mockAppsTokens.data[0] });
  useTokenBalances.mockReturnValue({ data: mockTokensBalance });

  it('Should render active validator profile details', () => {
    useSentStakes.mockReturnValue({
      data: {
        ...mockSentStakes,
        data: { ...mockReceivedStakes.data, stakes: mockReceivedStakes.data.stakers.slice(5, 7) },
      },
    });

    wrapper.rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ValidatorProfile {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('My validator profile')).toBeTruthy();
    expect(screen.getByText('Stake validator')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Performance')).toBeTruthy();
    expect(screen.getByText('Stakers')).toBeTruthy();

    expect(screen.getByText('Rank')).toBeTruthy();
    expect(screen.getAllByText('Validator name')).toBeTruthy();
    expect(screen.getByText('Validator weight')).toBeTruthy();
    expect(screen.getByText('Last generated at')).toBeTruthy();

    expect(screen.getByText('Last generated block height')).toBeTruthy();
    expect(screen.getByText('Blocks generated')).toBeTruthy();
    expect(screen.getByText('Rewards (LSK)')).toBeTruthy();
    expect(screen.getByText('Self stake')).toBeTruthy();
    expect(screen.getAllByText('Commission')[1]).toBeTruthy();
    expect(screen.getByText('Consecutive missed blocks')).toBeTruthy();

    expect(
      screen.getByText('This validator is among the first 101 validators by validator weight.')
    ).toBeTruthy();
    expect(
      screen.getByText('Active validators are selected to generate blocks every round.')
    ).toBeTruthy();

    expect(screen.getByText(mockBlocks.meta.total)).toBeTruthy();
    expect(screen.getByText(mockValidators.data[0].lastGeneratedHeight)).toBeTruthy();
    expect(screen.getByText(mockValidators.data[0].consecutiveMissedBlocks)).toBeTruthy();
    expect(screen.getByText(mockValidators.data[0].rank)).toBeTruthy();
    expect(
      screen.getByText(
        `${numeral(
          convertFromBaseDenom(mockValidators.data[0].validatorWeight, mockAppsTokens.data[0])
        ).format('0,0.[0000000000000]')} LSK`
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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ValidatorProfile {...props} />
        </MemoryRouter>
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ValidatorProfile {...props} />
        </MemoryRouter>
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ValidatorProfile {...props} />
        </MemoryRouter>
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ValidatorProfile {...props} />
        </MemoryRouter>
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ValidatorProfile {...props} />
        </MemoryRouter>
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ValidatorProfile {...props} />
        </MemoryRouter>
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ValidatorProfile {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Stake validator')).toBeTruthy();
  });
});
