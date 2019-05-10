import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import AddAccountTitle from './addAccountTitle';
import accounts from '../../../test/constants/accounts';

const fakeStore = configureStore();

describe('Add Account Title Component', () => {
  let wrapper;
  let props;
  let options;

  beforeEach(() => {
    const store = fakeStore({
      search: {
        accounts: {
          [accounts.delegate.address]: { delegate: accounts.delegate.address },
        },
      },
      followedAccounts: { LSK: [] },
    });

    props = {
      address: accounts.genesis.address,
      prevStep: spy(),
      t: key => key,
      addAccount: spy(),
    };

    options = {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };

    wrapper = mount(<AddAccountTitle {...props} />, options);
  });

  it('renders one Input components', () => {
    expect(wrapper.find('Input')).to.have.length(1);
  });

  it('renders two Button component', () => {
    expect(wrapper.find('Button')).to.have.length(2);
  });

  it('renders Input with delegate name if account is delegate', () => {
    props = {
      address: accounts.delegate.address,
    };
    wrapper.setProps(props);
    wrapper.update();
    expect(wrapper.find('Input.account-title')).to.have.prop('disabled');
  });

  it('accepts empty field', () => {
    wrapper.find('.account-title input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('Input.account-title').text()).to.not.contain('Required');
  });

  it('recognises too long title', () => {
    wrapper.find('.account-title input').simulate('change', { target: { value: 'this is a very long title' } });
    expect(wrapper.find('Input.account-title').text()).to.contain('Title too long');
  });

  it('cancels the process on button click', () => {
    wrapper.find('.cancel').first().simulate('click');
    expect(props.prevStep).to.have.been.calledWith({ reset: true });
  });

  it('goes to next step on button click', () => {
    wrapper.find('.account-title input').simulate('change', { target: { value: 'some title' } });
    wrapper.find('.next').first().simulate('click');
    expect(props.addAccount).to.have.been.calledWith({
      account: {
        address: accounts.genesis.address,
        title: 'some title',
        isDelegate: false,
      },
    });
  });
});
