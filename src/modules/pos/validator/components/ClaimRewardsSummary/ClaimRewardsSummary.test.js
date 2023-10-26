import { screen, fireEvent } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import wallets from '@tests/constants/wallets';
import { mockRewardsClaimableWithToken } from '@pos/reward/__fixtures__';
import { useAuth } from '@auth/hooks/queries';
import { mockAuth } from '@auth/__fixtures__';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import ClaimRewardsSummary from './index';

jest.mock('@account/hooks', () => ({
  ...jest.requireActual('@account/hooks'),
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0], jest.fn()]),
}));
jest.mock('@auth/hooks/queries');
jest.mock('@pos/reward/hooks/queries');
jest.mock('@pos/validator/hooks/usePosToken');

describe('ClaimRewardsSummary', () => {
  const props = {
    currentBlockHeight: 10000000,
    claimedRewards: jest.fn(),
    formProps: {
      composedFees: [
        {
          title: 'Transaction',
          value: '0 LSK',
          components: [],
        },
        {
          title: 'Message',
          value: '0 LSK',
          isHidden: true,
          components: [],
        },
      ],
      isValid: true,
      moduleCommand: 'pos:unlock',
    },
    selectedPriority: { title: 'Normal', selectedIndex: 0, value: 0 },
    transactionJSON: {
      fee: '0',
      nonce: '1',
      signatures: [],
      senderPublicKey: wallets.genesis.summary.publicKey,
      module: 'pos',
      command: 'unlock',
    },
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    t: (key) => key,
    wallet: wallets.genesis,
  };
  useAuth.mockReturnValue({ data: mockAuth });
  usePosToken.mockReturnValue({ token: mockAppsTokens.data[0] });
  useRewardsClaimable.mockReturnValue({ data: mockRewardsClaimableWithToken });
  const config = { queryClient: true /*  renderType: 'mount' */ };

  it('should display properly', async () => {
    smartRender(ClaimRewardsSummary, props, config);

    expect(screen.getByText('Confirm')).toBeTruthy();
  });

  it('should go to prev page when click Go back button', () => {
    smartRender(ClaimRewardsSummary, props, config);
    expect(props.prevStep).not.toBeCalled();
    fireEvent.click(screen.getByAltText('arrowLeftTailed'));
    expect(props.prevStep).toBeCalled();
  });

  it('should submit transaction and action function when click in confirm button', () => {
    smartRender(ClaimRewardsSummary, props, config);
    expect(props.nextStep).not.toBeCalled();
    fireEvent.click(screen.getByText('Confirm'));
    expect(props.nextStep).toBeCalledWith({
      actionFunction: props.claimedRewards,
      formProps: props.formProps,
      transactionJSON: props.transactionJSON,
    });
  });
});
