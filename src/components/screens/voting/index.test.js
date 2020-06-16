import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import Delegates from './index';
import { loginType } from '../../../constants/hwConstants';
import accounts from '../../../../test/constants/accounts';

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
const votes = {
  username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
};
const mockStore = {
  network: {
    networks: {
      LSK: { apiVersion: '2' },
    },
  },
  account: { address: delegates[0].address },
  voting: { votes, delegates: [] },
};
const mountWithProps = (props, store) =>
  mount(<Provider store={configureStore()(store)}><Delegates {...props} /></Provider>);

describe('Delegates', () => {
  const defaultProps = {
    delegates,
    votes,
    t: key => key,
    onBoardingDiscarded: false,
    history: { location: { search: '' } },
    clearVotes: jest.fn(),
    loadDelegates: jest.fn(),
    loadVotes: jest.fn(),
  };

  it('should allow to enable and disable voting mode', () => {
    const wrapper = mountWithProps(defaultProps, mockStore);
    wrapper.find('.start-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(1);

    wrapper.find('.cancel-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(0);
  });

  it('should show onboarding if not in guest mode', () => {
    const wrapper = mountWithProps(
      { ...defaultProps },
      { ...mockStore, account: { info: { LSK: { ...accounts.genesis } } } },
    );
    expect(wrapper.find('Onboarding')).to.have.lengthOf(1);
  });

  it('should not show "Register delegate" button if guest mode', () => {
    const wrapper = mountWithProps(
      { ...defaultProps },
      { ...mockStore, account: {} },
    );
    expect(wrapper.find('.register-delegate')).to.have.lengthOf(0);
  });

  it('should show "Register delegate" button if not a delegate', () => {
    const noDelegateAccount = {
      loginType: loginType.normal,
      address: delegates[0].address,
      hwInfo: {},
    };
    const wrapper = mountWithProps(
      { ...defaultProps },
      { ...mockStore, account: noDelegateAccount },
    );
    expect(wrapper.find('.register-delegate')).to.not.have.lengthOf(1);
  });

  it('should not show "Register delegate" button if already delegate', () => {
    const wrapper = mountWithProps(
      { ...defaultProps },
      { ...mockStore, account: { delegate: delegates[0], address: delegates[0].address } },
    );
    expect(wrapper.find('.register-delegate')).to.have.lengthOf(0);
  });
});
