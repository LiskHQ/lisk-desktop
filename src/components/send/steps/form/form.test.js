import React from 'react';
import { expect } from 'chai';
import { useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import accounts from '../../../../../test/constants/accounts';
import i18n from '../../../../i18n';
import Form from './form';

describe('Form Component', () => {
  let wrapper;
  let props;
  let clock;

  beforeEach(() => {
    const account = accounts.delegate;

    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });

    const priceTicker = {
      success: true,
      LSK: {
        USD: 1,
      },
    };

    const store = configureMockStore([thunk])({
      account,
      settings: {},
      settingsUpdated: () => {},
      liskService: { priceTicker },
    });

    props = {
      account,
      pendingTransactions: [],
      closeDialog: () => {},
      t: key => key,
      nextStep: () => {},
      history: { location: { search: '' } },
      followedAccounts: { accounts: [{ address: '123L', title: 'test' }] },
    };
    wrapper = mount(<Form {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  afterEach(() => {
    clock.restore();
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

  it('recognizes too big reference length', () => {
    wrapper.find('.reference input').simulate('change', { target: { value: 'test'.repeat(100) } });
    expect(wrapper.find('Input.reference').text()).to.contain('Maximum length exceeded');
  });

  it('displays bookmark', () => {
    const account = accounts.delegate;
    const followedAccounts = { accounts: [{ address: '123L', title: '123' }] };

    const store = configureMockStore([thunk])({
      account,
      settings: {},
      settingsUpdated: () => {},
      followedAccounts,
    });
    props.followedAccounts = followedAccounts.accounts;
    wrapper = mount(<Form {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });

    expect(wrapper.find('Bookmark')).to.have.length(1);
  });

  it('Shows the Set max. amount link on amount focus', () => {
    wrapper.find('.amount input').simulate('focus');
    expect(wrapper.state('showSetMaxAmount')).to.equal(true);
  });

  it('Puts max amount into input field', () => {
    wrapper.find('.amount input').simulate('focus');
    wrapper.find('.set-max-amount').simulate('click');
    expect(wrapper.state('amount').value).to.equal('999.9');
  });

  it('Hides the Set max. amount link on amount blur', () => {
    wrapper.find('.amount input').simulate('blur');
    clock.tick(1200);
    expect(wrapper.state('showSetMaxAmount')).to.equal(false);
  });
});
