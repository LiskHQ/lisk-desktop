import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import accounts from '../../../../test/constants/accounts';
import HeaderAccountInfo from './headerAccountInfo';

describe('HeaderAccountInfo Component', () => {
  const defaultProps = {
    address: accounts.genesis.address,
    followedAccounts: [],
    account: accounts.genesis,
    delegate: {},
    t: v => v,
  };

  it('Should show information for own account', () => {
    const props = { ...defaultProps };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).to.have.exactly(1).descendants('.label');
    expect(wrapper.find('.title')).to.have.text('Wallet');
    expect(wrapper.find('.label')).to.have.text('My Account');
    expect(wrapper.find('.address')).to.have.text(props.address);
  });

  it('Should show information for followed account', () => {
    const props = {
      ...defaultProps,
      followedAccounts: [{
        address: accounts['empty account'].address,
        title: 'following-test',
      }],
      address: accounts['empty account'].address,
    };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).to.have.exactly(1).descendants('.label');
    expect(wrapper.find('.title')).to.have.text('following-test');
    expect(wrapper.find('.label')).to.have.text('Followed Account');
  });

  it('Should show information for delegate account', () => {
    const props = {
      ...defaultProps,
      address: accounts.delegate.address,
      delegate: accounts.delegate,
    };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).to.have.exactly(1).descendants('.label');
    expect(wrapper.find('.title')).to.have.text(props.delegate.username);
    expect(wrapper.find('.label')).to.have.text('Delegate #{{rank}}');
  });

  it('Should show information for not followed account', () => {
    const props = {
      ...defaultProps,
      address: accounts['empty account'].address,
    };
    const wrapper = mount(<HeaderAccountInfo {...props} />);
    expect(wrapper).to.not.have.descendants('.label');
    expect(wrapper.find('.title')).to.have.text('Wallet');
  });
});
