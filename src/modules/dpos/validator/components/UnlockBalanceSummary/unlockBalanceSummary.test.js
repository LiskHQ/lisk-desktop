import React from 'react';
import { mount } from 'enzyme';
import wallets from '@tests/constants/wallets';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import Summary from './UnlockBalanceSummary';

describe('Locked balance Summary', () => {
  const props = {
    currentBlockHeight: 10000000,
    balanceUnlocked: jest.fn(),
    rawTx: {
      params: {
        unlockObjects: [],
      },
      isValid: true,
      moduleCommandID: MODULE_COMMANDS_NAME_ID_MAP.unlockToken,
    },
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    t: (key) => key,
    wallet: wallets.genesis,
  };

  afterEach(() => {
    props.nextStep.mockRestore();
  });

  it('renders properly Summary component', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(wrapper).toContainMatchingElement('.address-label');
    expect(wrapper).toContainMatchingElement('.amount-label');
    expect(wrapper).toContainMatchingElement('button.confirm-button');
    expect(wrapper).toContainMatchingElement('button.cancel-button');
  });

  it('go to prev page when click Go Back button', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(props.prevStep).not.toBeCalled();
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('submit transaction and action function when click in confirm button', () => {
    const wrapper = mount(<Summary {...props} />);
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({
      actionFunction: props.balanceUnlocked,
      rawTx: props.rawTx,
    });
  });
});
