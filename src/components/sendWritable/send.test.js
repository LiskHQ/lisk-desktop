import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import SendWritable from './send';

const fakeStore = configureStore();

describe('Send Writable Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const account = accounts.delegate;

    const store = fakeStore({
      account,
      settings: {},
      settingsUpdated: () => {},
    });

    props = {
      account,
      pendingTransactions: [],
      closeDialog: () => {},
      t: key => key,
      nextStep: () => {},
      history: { location: { search: '' } },
    };
    wrapper = mount(<SendWritable {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('renders three Input components', () => {
    expect(wrapper.find('Input')).to.have.length(3);
  });

  it('renders one Button component', () => {
    expect(wrapper.find('Button')).to.have.length(1);
  });

  it('accepts valid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    expect(wrapper.find('Input.amount').text()).to.not.contain('Invalid amount');
  });

  it('recognizes invalid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120 INVALID' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Invalid amount');
  });

  it('recognizes zero amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '0' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Zero not allowed');
  });

  it('recognizes too high amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Not enough LSK');
  });

  it('recognizes empty amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    wrapper.find('.amount input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Required');
  });

  it('accepts valid recipient', () => {
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
    expect(wrapper.find('Input.recipient').text()).to.not.contain('Invalid address');
  });

  it('recognizes invalid recipient', () => {
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952' } });
    expect(wrapper.find('Input.recipient').text()).to.contain('Invalid address');
  });
});
