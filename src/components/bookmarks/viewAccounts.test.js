import React from 'react';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import ViewAccounts from './viewAccounts';
import routes from '../../constants/routes';

const fakeStore = configureStore([thunk]);

describe('Followed accounts list Component', () => {
  let wrapper;
  const props = {
    address: '16313739661670634666L',
    nextStep: spy(),
    t: key => key,
    history: { push: spy() },
  };

  describe('Without bookmarks accounts', () => {
    beforeEach(() => {
      const store = fakeStore({
        bookmarks: { LSK: [] },
      });

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

  describe('With bookmarks accounts', () => {
    beforeEach(() => {
      const store = fakeStore({
        bookmarks: {
          LSK: [
            {
              address: '123L', title: 'bob', isDelegate: false,
            }, {
              address: '567L', title: '', isDelegate: false,
            }, {
              address: '23467L', title: '', isDelegate: false,
            }, {
              address: '23464567L', title: '', isDelegate: false,
            }, {
              address: '2346456347L', title: '', isDelegate: false,
            }, {
              address: '234645634347L', title: '', isDelegate: false,
            },
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

    it('shows list of bookmarks accounts', () => {
      expect(wrapper.find('.followed-accounts-empty-list')).to.have.length(0);
      expect(wrapper.find('.followed-accounts-list')).to.have.length(1);

      expect(wrapper.find('.account-title input').at(0)).to.have.value('bob');

      expect(wrapper.find('.account-title input').at(1)).to.have.value('567L');
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
      expect(wrapper.find('.editMode span').at(0)).to.not.be.eq('123L');
    });

    it('edits an accounts title', () => {
      expect(wrapper.find('.account-title input').at(1)).to.have.value('567L');

      // activate edit mode
      wrapper.find('.edit-accounts').simulate('click');

      wrapper.find('.account-title input').at(1).simulate('change', { target: { value: '' } });
      // exit edit mode
      wrapper.find('.edit-accounts').simulate('click');

      expect(wrapper.find('.account-title input').at(1)).to.have.value('567L');

      // activate edit mode
      wrapper.find('.edit-accounts').simulate('click');

      wrapper.find('.account-title input').at(1).simulate('change', { target: { value: 'this is a very long title' } });
      // exit edit mode
      wrapper.find('.edit-accounts').simulate('click');

      expect(wrapper.find('.account-title input').at(1)).to.have.value('567L');

      // activate edit mode
      wrapper.find('.edit-accounts').simulate('click');

      wrapper.find('.account-title input').at(1).simulate('change', { target: { value: 'my friend' } });
      // exit edit mode
      wrapper.find('.edit-accounts').simulate('click');

      expect(wrapper.find('.account-title input').at(1)).to.have.value('my friend');
    });

    it('should render showMore button propery', () => {
      expect(wrapper.find('.show-more').exists()).to.equal(true);
      expect(wrapper.find('.showMoreToggle').exists()).to.equal(false);
      wrapper.find('.show-more').at(0).simulate('click');
      wrapper.update();
      expect(wrapper.find('.showMoreToggle').exists()).to.equal(true);
      wrapper.find('.show-more').at(0).simulate('click');
      wrapper.update();
      expect(wrapper.find('.showMoreToggle').exists()).to.equal(false);
    });
  });
});
