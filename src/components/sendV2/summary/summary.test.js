import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';
import Summary from './summary';

describe('Summary', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    settings: { currency: 'USD' },
    settingsUpdated: () => {},
    liskService: {
      success: true,
      LSK: {
        USD: 1,
      },
    },
    followedAccounts: [
      {
        title: 'ABC',
        address: '12345L',
        balance: 10,
      },
      {
        title: 'FRG',
        address: '12375L',
        balance: 15,
      },
      {
        title: 'KTG',
        address: '12395L',
        balance: 7,
      },
    ],
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  const props = {
    t: v => v,
    account: {
      address: accounts['second passphrase account'].address,
      secondPublicKey: accounts['second passphrase account'].secondPublicKey,
    },
    failedTransactions: '',
    pendingTransactions: [],
    fields: {
      recipient: {
        address: '123123L',
      },
      amount: {
        value: 1,
      },
      reference: {
        value: 1,
      },
      isLoading: false,
      isHardwareWalletConnected: false,
    },
    prevState: {
      fields: {},
    },
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    sent: jest.fn(),
    isLoading: false,
    isHardwareWalletConnected: false,
  };

  beforeEach(() => {
    wrapper = mount(<Summary {...props} />, options);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.summary');
    expect(wrapper).toContainMatchingElement('.summary-header');
    expect(wrapper).toContainMatchingElement('.summary-content');
    expect(wrapper).toContainMatchingElement('.summary-footer');
    expect(wrapper).toContainMatchingElement('.summary-second-passphrase');
  });

  it('should goind to previous page', () => {
    wrapper.find('.on-prevStep').at(0).simulate('click');
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });

  it('should goind to next page if everyting is successfull', () => {
    const clipboardData = {
      getData: () => accounts['second passphrase account'].secondPassphrase,
    };
    wrapper.find('passphraseInputV2 input').first().simulate('paste', { clipboardData });
    wrapper.update();
    wrapper.find('.on-nextStep').at(0).simulate('click');
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });

  it('should goind to next page if everyting is successfull by Hardware Wallet', () => {
    const newProps = { ...props };
    newProps.account = {
      ...props.account,
      hwInfo: {
        deviceId: '123123sdf',
      },
    };
    wrapper = mount(<Summary {...newProps} />, options);
    wrapper.setProps({
      ...props,
      pendingTransactions: [{
        senderId: accounts['second passphrase account'].address,
        recipientId: '123123L',
        amount: 1,
      }],
      fields: {
        ...props.fields,
        isLoading: true,
      },
    });
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });
});
