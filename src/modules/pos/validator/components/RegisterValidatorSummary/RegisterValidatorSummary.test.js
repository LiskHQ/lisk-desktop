import React from 'react';
import { mount } from 'enzyme';
import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import accounts from '@tests/constants/wallets';
import { useAuth } from '@auth/hooks/queries';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import Summary from './RegisterValidatorSummary';

const mockedCurrentAccount = mockSavedAccounts[0];
jest.mock('@auth/hooks/queries');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

describe('Validator Registration Summary', () => {
  const props = {
    validatorRegistered: jest.fn(),
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
      moduleCommand: 'pos:registerValidator',
    },
    selectedPriority: { title: 'Normal', selectedIndex: 0, value: 0 },
    transactionJSON: {
      fee: '0',
      nonce: '1',
      signatures: [],
      senderPublicKey: accounts.genesis.summary.publicKey,
      module: 'pos',
      command: 'registerValidator',
      params: {
        username: 'myvalidator',
      },
    },
    account: accounts.genesis,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    t: (key) => key,
  };

  afterEach(() => {
    props.nextStep.mockRestore();
  });

  useAuth.mockReturnValue({ data: mockAuth });

  it('renders properly Summary component', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(wrapper).toContainMatchingElement('.username-label');
    expect(wrapper).toContainMatchingElement('.username');
    expect(wrapper).toContainMatchingElement('.address');
    expect(wrapper).toContainMatchingElement('button.confirm-button');
    expect(wrapper).toContainMatchingElement('button.cancel-button');
  });

  it('go to prev page when click Go Back button', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(props.prevStep).not.toBeCalled();
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('submit user data when click in confirm button', () => {
    const wrapper = mountWithRouterAndStore(Summary, props, {}, {});
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({
      actionFunction: props.validatorRegistered,
      formProps: props.formProps,
      transactionJSON: props.transactionJSON,
    });
  });
});
