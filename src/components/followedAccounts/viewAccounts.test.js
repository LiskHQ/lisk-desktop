import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import ViewAccounts from './viewAccounts';
import routes from '../../constants/routes';
import * as followedAccounts from '../../actions/followedAccounts';

const fakeStore = configureStore();

describe('Followed accounts list Component', () => {
  let wrapper;
  const props = {
    address: '16313739661670634666L',
    nextStep: spy(),
    t: key => key,
    history: { push: spy() },
  };

  describe('Without followed accounts', () => {
    beforeEach(() => {
      const store = fakeStore({ followedAccounts: { accounts: [] } });

      wrapper = mount(<ViewAccounts {...props} />, {
        context: { store, i18n },
        childContextTypes: {
          store: PropTypes.object.isRequired,
          i18n: PropTypes.object.isRequired,
        },
      });
    });


    it('shows empty list', () => {
      expect(wrapper.find('.followed-accounts-empty-list')).to.have.length(1);
      expect(wrapper.find('.followed-accounts-list')).to.have.length(0);
    });

    it('goes to next step on button click', () => {
      wrapper.find('.add-account-button').simulate('click');
      expect(props.nextStep).to.have.been.calledWith();
    });
  });

  describe('With followed accounts', () => {
    beforeEach(() => {
      spy(followedAccounts, 'followedAccountUpdated');
      spy(followedAccounts, 'followedAccountRemoved');

      const store = fakeStore({
        followedAccounts: {
          accounts: [
            { address: '123L', balance: 0, title: 'bob' },
            { address: '567L', balance: 100000, title: '' },
          ],
        },
      });

      wrapper = mount(<ViewAccounts {...props} />, {
        context: { store, i18n },
        childContextTypes: {
          store: PropTypes.object.isRequired,
          i18n: PropTypes.object.isRequired,
        },
      });
    });

    afterEach(() => {
      followedAccounts.followedAccountUpdated.restore();
      followedAccounts.followedAccountRemoved.restore();
    });

    it('shows list of followed accounts', () => {
      expect(wrapper.find('.followed-accounts-empty-list')).to.have.length(0);
      expect(wrapper.find('.followed-accounts-list')).to.have.length(1);

      expect(wrapper.find('.account-title input').at(0)).to.have.value('bob');
      expect(wrapper.find('LiskAmount').at(0).text()).to.contain(0);

      expect(wrapper.find('.account-title input').at(1)).to.have.value('567L');
      expect(wrapper.find('LiskAmount').at(1).text()).to.contain(1);
    });

    it('directs you to account page on click', () => {
      wrapper.find('.followed-account').at(0).simulate('click');
      expect(props.history.push).to.have.been.calledWith(`${routes.explorer.path}${routes.accounts.path}/123L`);
    });

    it('goes to next step on button click', () => {
      wrapper.find('.add-account-button').simulate('click');
      expect(props.nextStep).to.have.been.calledWith();
    });

    it('removes an account', () => {
      expect(wrapper.find('.remove-account')).to.have.length(0);

      wrapper.find('.edit-accounts').simulate('click');
      wrapper.find('.remove-account').at(0).simulate('click');

      expect(followedAccounts.followedAccountRemoved).to.have.been.calledWith({
        address: '123L', balance: 0, title: 'bob',
      });
    });

    it('edits an accounts title', () => {
      expect(wrapper.find('.account-title input').at(1)).to.have.value('567L');

      // activate edit mode
      wrapper.find('.edit-accounts').simulate('click');

      wrapper.find('.account-title input').at(1).simulate('change', { target: { value: '' } });
      // exit edit mode
      wrapper.find('.edit-accounts').simulate('click');

      expect(followedAccounts.followedAccountUpdated).to.not.have.been.calledWith();

      // activate edit mode
      wrapper.find('.edit-accounts').simulate('click');

      wrapper.find('.account-title input').at(1).simulate('change', { target: { value: 'this is a very long title' } });
      // exit edit mode
      wrapper.find('.edit-accounts').simulate('click');

      expect(followedAccounts.followedAccountUpdated).to.not.have.been.calledWith();

      // activate edit mode
      wrapper.find('.edit-accounts').simulate('click');

      wrapper.find('.account-title input').at(1).simulate('change', { target: { value: 'my friend' } });
      // exit edit mode
      wrapper.find('.edit-accounts').simulate('click');

      expect(wrapper.find('.account-title input').at(1)).to.have.value('my friend');
      expect(followedAccounts.followedAccountUpdated).to.have.been.calledWith({
        address: '567L', balance: 100000, title: 'my friend',
      });
    });
  });
});
