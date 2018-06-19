import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import AddAccountTitle from './addAccountTitle';
import * as followedAccounts from '../../actions/followedAccounts';

const fakeStore = configureStore();

describe('Add Account Title Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const store = fakeStore({});

    spy(followedAccounts, 'followedAccountAdded');

    props = {
      address: '16313739661670634666L',
      prevStep: spy(),
      t: key => key,
    };

    wrapper = mount(<AddAccountTitle {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  afterEach(() => {
    followedAccounts.followedAccountAdded.restore();
  });

  it('renders one Input components', () => {
    expect(wrapper.find('Input')).to.have.length(1);
  });

  it('renders two Button component', () => {
    expect(wrapper.find('Button')).to.have.length(2);
  });

  it('accepts empty field', () => {
    wrapper.find('.title input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('Input.title').text()).to.not.contain('Required');
  });

  it('recognises too long title', () => {
    wrapper.find('.title input').simulate('change', { target: { value: 'this is a very long title' } });
    expect(wrapper.find('Input.title').text()).to.contain('Title too long');
  });

  it('cancels the process on button click', () => {
    wrapper.find('.cancel').first().simulate('click');
    expect(props.prevStep).to.have.been.calledWith({ reset: true });
  });

  it('goes to next step on button click', () => {
    wrapper.find('.title input').simulate('change', { target: { value: 'some title' } });
    wrapper.find('.next').first().simulate('click');
    expect(followedAccounts.followedAccountAdded).to.have.been.calledWith({
      address: '16313739661670634666L',
      title: 'some title',
    });
  });
});
