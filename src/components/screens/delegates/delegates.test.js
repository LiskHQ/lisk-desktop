import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import Delegates from './delegates';
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
    history: { location: { search: '' } },
    clearVotes: jest.fn(),
    account: { address: delegates[0].address },
    loadDelegates: jest.fn(),
    loadVotes: jest.fn(),
  };
  it('should allow to enable and disable voting mode', () => {
    wrapper = mount(<Router><Delegates {...props} /></Router>);
    wrapper.find('.start-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(1);

    wrapper.find('.cancel-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(0);
  });

  it('should show onboarding if not in guest mode', () => {
    wrapper = mount(<Router>
      <Delegates {...props} account={accounts.genesis} />
    </Router>);
    expect(wrapper.find('Onboarding')).to.have.lengthOf(1);
  });

  it('should not show "Register delegate" button if guest mode', () => {
    wrapper = mount(<Router>
      <Delegates {...props} account={{}} />
    </Router>);
    expect(wrapper.find('.register-delegate')).to.have.lengthOf(0);
  });

  it('should not show "Register delegate" button if already delegate', () => {
    wrapper = mount(<Router>
      <Delegates {...{
        ...props,
        account: { delegate: delegates[0], address: delegates[0].address },
      }}
      />
    </Router>);
    expect(wrapper.find('.register-delegate')).to.have.lengthOf(0);
  });
});
