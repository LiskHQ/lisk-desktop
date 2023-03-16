import React from 'react';
import { render, screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import wallets from '@tests/constants/wallets';
import { mockRewardsClaimableWithToken } from '@pos/reward/__fixtures__';
import { useAuth } from '@auth/hooks/queries';
import { mockAuth } from '@auth/__fixtures__';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import { mount } from 'enzyme';
import ClaimRewardsSummary from './index';

jest.mock('@account/hooks', () => ({
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

  it('should display properly', async () => {
    render(<ClaimRewardsSummary {...props} />);

    expect(screen.getByText('Confirm')).toBeTruthy();
  });

  it('should go to prev page when click Go Back button', () => {
    const wrapper = mount(<ClaimRewardsSummary {...props} />);
    expect(props.prevStep).not.toBeCalled();
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('should submit transaction and action function when click in confirm button', () => {
    const wrapper = mount(<ClaimRewardsSummary {...props} />);
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({
      actionFunction: props.claimedRewards,
      formProps: props.formProps,
      transactionJSON: props.transactionJSON,
    });
  });
});
