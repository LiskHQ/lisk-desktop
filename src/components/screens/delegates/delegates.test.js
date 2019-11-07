import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Delegates from './delegates';
import { loginType } from '../../../constants/hwConstants';
import accounts from '../../../../test/constants/accounts';

describe('Delegates', () => {
  let wrapper;
  const votes = {
    username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
  };

  const delegates = [
    {
      address: 'address 1',
      username: 'username1',
      publicKey: 'sample_key',
      serverPublicKey: 'sample_key',
      rank: 12,
    },
    {
      address: 'address 2',
      username: 'username2',
      publicKey: 'sample_key',
      serverPublicKey: 'sample_key',
      rank: 23,
    },
  ];
  const props = {
    delegates,
    votes,
    t: key => key,
    onBoardingDiscarded: false,
    history: { location: { search: '' } },
    clearVotes: jest.fn(),
    account: { address: delegates[0].address },
    loadDelegates: jest.fn(),
    loadVotes: jest.fn(),
  };
  it('should allow to enable and disable voting mode', () => {
    wrapper = mount(<Delegates {...props} />);
    wrapper.find('.start-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(1);

    wrapper.find('.cancel-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(0);
  });

  it('should show onboarding if not in guest mode', () => {
    wrapper = mount(<Delegates {...props} account={accounts.genesis} />);
    expect(wrapper.find('Onboarding')).to.have.lengthOf(1);
  });

  it('should not show "Register delegate" button if guest mode', () => {
    wrapper = mount(<Delegates {...props} account={{}} />);
    expect(wrapper.find('.register-delegate')).to.have.lengthOf(0);
  });

  it('should show "Register delegate" button if not a delegate', () => {
    const noDelegateAccount = {
      loginType: loginType.normal,
      address: delegates[0].address,
      hwInfo: {},
    };
    wrapper = mount(<Delegates {...props} account={noDelegateAccount} />);
    expect(wrapper.find('.register-delegate')).to.not.have.lengthOf(0);
  });

  it('should not show "Register delegate" button if already delegate', () => {
    wrapper = mount(
      <Delegates {...{
        ...props,
        account: { delegate: delegates[0], address: delegates[0].address },
      }}
      />,
    );
    expect(wrapper.find('.register-delegate')).to.have.lengthOf(0);
  });
});
