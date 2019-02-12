import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import configureMockStore from 'redux-mock-store';
import { mountWithContext } from '../../../test/unit-test-utils/mountHelpers';
import SendTo from './send';
import * as followedAccounts from '../../actions/followedAccounts';
import routes from './../../constants/routes';

describe('SendTo Component', () => {
  let wrapper;
  const account = {
    balance: 0,
    address: '12345L',
    isDelegate: true,
  };
  const props = {
    nextStep: spy(),
    account,
    delegate: {
      username: 'peter',
    },
    t: key => key,
  };

  describe('Basic information', () => {
    beforeEach(() => {
      const store = configureMockStore([])({
        followedAccounts: { accounts: [] },
        account,
        search: {},
        liskAPIClientSet: () => {},
      });

      wrapper = mountWithContext(<SendTo {...props} store={store} />, { storeState: store });
      wrapper.setProps({ account });
    });

    it('shows balance', () => {
      expect(wrapper.find('LiskAmount')).to.have.length(1);
    });

    it('renders correct link', () => {
      expect(wrapper.find('Link').prop('to')).to.equal(`${routes.send.path}?recipient=${props.address}`);
    });

    it('updates when address changes', () => {
      wrapper.setProps({ address: '9876L' });
      wrapper.update();
      expect(wrapper.find('Link').prop('to')).to.equal(`${routes.send.path}?recipient=9876L`);
    });

    it('renders delegate username', () => {
      expect(wrapper.find('.delegate-name').first()).to.have.text('peter');
    });
  });

  describe('Without followed account', () => {
    beforeEach(() => {
      const store = configureMockStore([])({
        followedAccounts: { accounts: [] },
        account,
        search: {},
        liskAPIClientSet: () => {},
      });

      wrapper = mountWithContext(<SendTo {...props} store={store} />, { storeState: store });
      wrapper.setProps({ account });
    });


    it('goes to next step to add account', () => {
      wrapper.find('.follow-account').first().simulate('click');
      expect(props.nextStep).to.have.been.calledWith();
    });
  });

  describe('With followed account', () => {
    beforeEach(() => {
      spy(followedAccounts, 'followedAccountRemoved');
      const store = configureMockStore([])({
        followedAccounts: { accounts: [account] },
        account,
        search: {},
        liskAPIClientSet: () => {},
      });

      wrapper = mountWithContext(<SendTo {...props} store={store} />, { storeState: store });
      wrapper.setProps({ account });
    });

    afterEach(() => {
      followedAccounts.followedAccountRemoved.restore();
    });

    it('removes account', () => {
      wrapper.find('.follow-account').first().simulate('click');
      expect(followedAccounts.followedAccountRemoved).to.have.been.calledWith();
    });
  });
});
