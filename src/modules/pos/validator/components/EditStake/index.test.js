import { fireEvent, screen, waitFor } from '@testing-library/react';
import { fromRawLsk, toRawLsk } from '@token/fungible/utils/lsk';
import numeral from 'numeral';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockBlocks } from '@block/__fixtures__';
import { useAuth } from '@auth/hooks/queries';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { mockValidators, mockSentStakes } from '@pos/validator/__fixtures__';
import { useLatestBlock } from 'src/modules/block/hooks/queries/useLatestBlock';
import { mockTokensBalance } from 'src/modules/token/fungible/__fixtures__';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import EditStake from './index';
import { useValidators, useSentStakes, usePosConstants } from '../../hooks/queries';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';

jest.mock('@transaction/api', () => ({
  getTransactionFee: jest.fn().mockImplementation(() => Promise.resolve({ value: '0.046' })),
}));

const mockedCurrentAccount = mockSavedAccounts[0];
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));
jest.mock('@transaction/hooks/queries/useSchemas', () => ({
  useSchemas: jest.fn(),
}));
jest.mock('@network/hooks', () => ({
  useCommandSchema: jest.fn(() => ({
    moduleCommandSchemas: {},
  })),
}));

jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('../../hooks/queries');
jest.mock('@token/fungible/hooks/queries');
jest.mock('@auth/hooks/queries');

describe('EditStake', () => {
  const validatorAddress = 'lskjq7jh2k7q332wgkz3bxogb8bj5zc3fcnb9ya53';
  const props = {
    history: { location: { search: `?address=${validatorAddress}` }, push: jest.fn() },
    stakeEdited: jest.fn(),
    network: {},
    staking: {},
  };
  const address = 'lsk6wrjbs66uo9eoqr4t86afvd4yym6ovj4afunvh';
  const updatedProps = {
    ...props,
    history: { ...props.history, location: { search: `?address=${address}` } },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useValidators.mockReturnValue({ data: mockValidators });
    useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });
    useSentStakes.mockReturnValue({ data: mockSentStakes, isSuccess: true });
    useAuth.mockReturnValue({ data: mockAuth });
    usePosConstants.mockReturnValue({ data: mockPosConstants });
    useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
  });

  it('should properly render add stake form', () => {
    const validator = mockValidators.data[0];
    const token = mockTokensBalance.data[0];

    renderWithRouterAndQueryClient(EditStake, updatedProps);

    expect(screen.getByText('Add to staking queue')).toBeTruthy();
    expect(screen.getByText(address)).toBeTruthy();
    expect(screen.getByText(validator.name)).toBeTruthy();
    expect(screen.getByTestId(`wallet-visual-${address}`)).toBeTruthy();
    expect(screen.getByText('Available balance:')).toBeTruthy();
    expect(
      screen.getByText(
        `${numeral(fromRawLsk(token.availableBalance)).format('0,0.[0000000000000]')} ${token.symbol
        }`
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Input your Stake amount. This value shows how much trust you have in this validator.'
      )
    ).toBeTruthy();
    expect(screen.getByText('Stake amount ({{symbol}})')).toBeTruthy();
  });

  it('should add stake to the stakes queue', async () => {
    renderWithRouterAndQueryClient(EditStake, props);
    const validator = mockValidators.data[0];
    const stakingField = screen.getByTestId('stake');

    fireEvent.change(stakingField, { target: { value: 20 } });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(props.stakeEdited).toHaveBeenCalledWith([
        {
          address: validatorAddress,
          name: validator.name,
          amount: toRawLsk(20),
        },
      ]);
    });
  });

  it('should render the confirmation modal and go back to the staking form', () => {
    renderWithRouterAndQueryClient(EditStake, updatedProps);

    fireEvent.click(screen.getByText('Confirm'));
    expect(screen.getByText('Stake added')).toBeTruthy();
    expect(screen.getByText('Your stake has been added to your staking queue')).toBeTruthy();

    fireEvent.click(screen.getByText('Continue staking'));
    expect(props.history.push).toHaveBeenCalled();
  });

  it('should render the confirmation modal and proceed to the staking queue', async () => {
    renderWithRouterAndQueryClient(EditStake, updatedProps);

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Go to the staking queue'));
    });

    expect(props.history.push).toHaveBeenCalled();
  });

  it('should render the edit stake modal', async () => {
    const validator = mockValidators.data[0];

    useSentStakes.mockReturnValue({
      data: {
        ...mockSentStakes,
        data: {
          ...mockSentStakes.data,
          stakes: mockSentStakes.data.stakes.map((stake, index) =>
            index === 0 ? { ...stake, address: validatorAddress } : stake
          ),
        },
      },
    });

    renderWithRouterAndQueryClient(EditStake, props);

    expect(screen.getByText('Edit Stake')).toBeTruthy();
    expect(
      screen.getByText('After changing your stake amount, it will be added to the staking queue.')
    ).toBeTruthy();
    expect(screen.getByText('Stake amount ({{symbol}})')).toBeTruthy();

    const stakingField = screen.getByTestId('stake');

    fireEvent.change(stakingField, { target: { value: 20 } });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(props.stakeEdited).toHaveBeenCalledWith([
        {
          address: validatorAddress,
          name: validator.name,
          amount: toRawLsk(20),
        },
      ]);
    });

    expect(screen.getByText('Stake added')).toBeTruthy();
    expect(screen.getByText('Your stake has been added to your staking queue')).toBeTruthy();

    fireEvent.click(screen.getByText('Continue staking'));
    expect(props.history.push).toHaveBeenCalled();
  });
});
