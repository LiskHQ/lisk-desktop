import { fireEvent, screen, waitFor } from '@testing-library/react';
import { convertToBaseDenom, convertFromBaseDenom } from '@token/fungible/utils/helpers';
import numeral from 'numeral';
import {
  renderWithRouterAndQueryClient,
  renderWithRouterAndStore,
  renderWithRouterAndStoreAndQueryClient,
} from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockBlocks } from '@block/__fixtures__';
import { useAuth } from '@auth/hooks/queries';
import { useTokenBalances } from '@token/fungible/hooks/queries';
import { mockValidators, mockSentStakes } from '@pos/validator/__fixtures__';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { mockTokensBalance, mockAppsTokens } from '@token/fungible/__fixtures__';
import { mockAuth } from '@auth/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import useFiatRates from 'src/modules/common/hooks/useFiatRates';
import EditStake from './index';
import { useValidators, useSentStakes, usePosConstants } from '../../hooks/queries';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';
import { convertCommissionToPercentage } from '../../utils';

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
jest.mock('../../hooks/queries', () => ({
  ...jest.requireActual('../../hooks/queries'),
  useValidators: jest.fn(),
  useSentStakes: jest.fn(),
  usePosConstants: jest.fn(),
}));
jest.mock('@token/fungible/hooks/queries');
jest.mock('@auth/hooks/queries');
jest.mock('@pos/validator/hooks/usePosToken');
jest.mock('src/modules/common/hooks/useFiatRates');

describe('EditStake', () => {
  const validatorAddress = 'lskjq7jh2k7q332wgkz3bxogb8bj5zc3fcnb9ya53';
  const stakingStoreValue = {
    lskn3kjdanry8v272fyqky8nx7nc358sedo8rzmw2: {
      confirmed: 1000000000,
      name: 'genesis_66',
      unconfirmed: 3000000000,
    },
    lsknm4djcs98mpu87m9cjsawy7eqp8cpk4v7u8gdz: {
      confirmed: 2000000000,
      name: 'genesis_8',
      unconfirmed: 4000000000,
    },
  };
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
    useTokenBalances.mockReturnValue({ data: mockTokensBalance, isLoading: false });
    usePosToken.mockReturnValue({
      token: { ...mockAppsTokens.data[0], availableBalance: '1000000000' },
    });
    useFiatRates.mockReturnValue({ LSK: { USD: 1, EUR: 1 } });
  });

  it('should properly render add stake form', () => {
    const validator = mockValidators.data[0];
    const token = mockTokensBalance.data[0];

    renderWithRouterAndStore(EditStake, updatedProps, { staking: stakingStoreValue });

    expect(screen.getByText('Add to staking queue')).toBeTruthy();
    expect(screen.getByText(validator.address)).toBeTruthy();
    expect(screen.getByText(validator.name)).toBeTruthy();
    expect(screen.getByTestId(`wallet-visual-${address}`)).toBeTruthy();
    expect(screen.getByText('Available balance:')).toBeTruthy();
    expect(screen.getByText('Commission:')).toBeTruthy();
    expect(
      screen.getByText(`${convertCommissionToPercentage(validator.commission)}%`)
    ).toBeTruthy();
    expect(
      screen.getByText(
        `${numeral(convertFromBaseDenom(token.availableBalance, mockAppsTokens.data[0])).format(
          '0,0.[0000000000000]'
        )} ${token.symbol}`
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Input your Stake amount. This value shows how much trust you have in this validator.'
      )
    ).toBeTruthy();
    expect(screen.getByText('Stake amount')).toBeTruthy();
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
          amount: convertToBaseDenom(20, mockAppsTokens.data[0]),
          validator,
        },
      ]);
    });
  });

  it('should not be able to confirm when stake amount is not changed', () => {
    renderWithRouterAndQueryClient(EditStake, props);

    expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');
  });

  it('should be able to remove entire stake and add to queue', () => {
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
    expect(screen.getByText('Stake amount')).toBeTruthy();

    fireEvent.click(screen.getByText('Remove stake'));

    expect(screen.getByText('Stake added to queue')).toBeTruthy();
    expect(screen.getByText('Your stake has been added to your staking queue')).toBeTruthy();

    fireEvent.click(screen.getByText('Continue staking'));
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
    expect(screen.getByText('Stake amount')).toBeTruthy();

    const stakingField = screen.getByTestId('stake');

    fireEvent.change(stakingField, { target: { value: 20 } });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(props.stakeEdited).toHaveBeenCalledWith([
        {
          amount: convertToBaseDenom(20, mockAppsTokens.data[0]),
          validator,
        },
      ]);
    });

    expect(screen.getByText('Stake added to queue')).toBeTruthy();
    expect(screen.getByText('Your stake has been added to your staking queue')).toBeTruthy();

    fireEvent.click(screen.getByText('Continue staking'));
    expect(props.history.push).toHaveBeenCalled();
  });

  describe('Staking validation', () => {
    const stakedValidatorAddress = 'lsk6wrjbs66uo9eoqr4t86afvd4yym6ovj4afunvh';
    const stakingValues = {
      [stakedValidatorAddress]: {
        confirmed: 4000000000,
        name: 'genesis_8',
        unconfirmed: 4000000000,
      },
    };
    const customProps = {
      ...props,
      history: { ...props.history, location: { search: `?address=${stakedValidatorAddress}` } },
      staking: stakingValues,
    };

    delete window.location;
    window.location = new URL(`http://localhost/?address=${stakedValidatorAddress}`);

    usePosToken.mockReturnValue({
      token: { ...mockAppsTokens.data[0], availableBalance: '500000000' },
    });

    it('should not return an error when un-staked value is greater than the token balance', async () => {
      renderWithRouterAndQueryClient(EditStake, customProps);

      expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');

      const stakingField = screen.getByTestId('stake');
      fireEvent.change(stakingField, { target: { value: 20 } });

      await waitFor(() => {
        expect(screen.queryByText('Confirm')).not.toHaveAttribute('disabled');
      });
    });

    it('should return an error when (unconfirmed - confirmed) value is greater than the token balance', async () => {
      renderWithRouterAndStoreAndQueryClient(EditStake, customProps, { staking: stakingValues });
      expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');

      const stakingField = screen.getByTestId('stake');
      fireEvent.change(stakingField, { target: { value: 100 } });

      await waitFor(() => {
        expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');
        expect(
          screen.queryByText('The provided amount is higher than your available staking balance.')
        ).toBeTruthy();
      });
    });

    it('should return an error if inputted amount is negative', async () => {
      renderWithRouterAndStoreAndQueryClient(EditStake, customProps, { staking: stakingValues });

      expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');

      const stakingField = screen.getByTestId('stake');
      fireEvent.change(stakingField, { target: { value: -20 } });

      await waitFor(() => {
        expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');
        expect(screen.queryByText(`Stake amount can't be zero or negative.`)).toBeTruthy();
      });
    });

    it('should not return an error if inputted amount is 0', async () => {
      renderWithRouterAndStoreAndQueryClient(EditStake, customProps, { staking: stakingValues });

      expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');

      const stakingField = screen.getByTestId('stake');
      fireEvent.change(stakingField, { target: { value: 0 } });

      await waitFor(() => {
        expect(screen.queryByText('Confirm')).not.toHaveAttribute('disabled');
      });
    });

    it('should return an error if inputted amount is not a multiple of 10', async () => {
      renderWithRouterAndStoreAndQueryClient(EditStake, customProps, { staking: stakingValues });

      expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');

      const stakingField = screen.getByTestId('stake');
      fireEvent.change(stakingField, { target: { value: 10.11 } });

      await waitFor(() => {
        expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');
        expect(screen.queryByText(`You can only stake in multiplies of 10 LSK.`)).toBeTruthy();
      });

      fireEvent.change(stakingField, { target: { value: 15 } });

      await waitFor(() => {
        expect(screen.queryByText('Confirm')).toHaveAttribute('disabled');
        expect(screen.queryByText(`You can only stake in multiplies of 10 LSK.`)).toBeTruthy();
      });

      fireEvent.change(stakingField, { target: { value: 20 } });

      await waitFor(() => {
        expect(screen.queryByText('Confirm')).not.toHaveAttribute('disabled');
      });
    });
  });
});
