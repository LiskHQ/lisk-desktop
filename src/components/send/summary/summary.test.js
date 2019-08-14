import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';
import Summary from './summary';
import { tokenMap } from '../../../constants/tokens';

describe('Summary', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    settings: { currency: 'USD', token: { active: tokenMap.LSK.key } },
    settingsUpdated: () => {},
    liskService: {
      success: true,
      LSK: {
        USD: 1,
      },
    },
    bookmarks: [
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
    transactions: {
      pending: [],
      fail: {},
      transactionsCreated: [],
      transactionsCreatedFailed: [],
      broadcastedTransactionsError: [],
    },
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
      address: accounts.second_passphrase_account.address,
      secondPublicKey: accounts.second_passphrase_account.secondPublicKey,
      hwInfo: {
        deviceModel: 'Ledger Nano S',
      },
    },
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
      processingSpeed: {
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
    transactionCreated: jest.fn(),
    resetTransactionResult: jest.fn(),
    isLoading: false,
    isHardwareWalletConnected: false,
    transactions: {
      pending: [],
      failed: '',
      transactionsCreated: [],
      transactionsCreatedFailed: [],
      broadcastedTransactionsError: [],
    },
    token: tokenMap.LSK.key,
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
    wrapper.find('.cancel-button').at(0).simulate('click');
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });

  it('should disable "Next" button if secondPassphrase invalid for active account', () => {
    expect(wrapper.find('.confirm-button').at(0).prop('disabled')).toBeTruthy();
    const clipboardData = {
      getData: () => accounts.second_passphrase_account.passphrase,
    };
    wrapper.find('passphraseInput input').first().simulate('paste', { clipboardData });
    expect(wrapper.find('.confirm-button').at(0).prop('disabled')).toBeTruthy();
  });

  it('should call transactionCreated function after do a click in confirm button', () => {
    const clipboardData = {
      getData: () => accounts.second_passphrase_account.secondPassphrase,
    };
    wrapper.find('passphraseInput input').first().simulate('paste', { clipboardData });
    wrapper.update();
    wrapper.find('.confirm-button').at(0).simulate('click');
    wrapper.update();
    expect(props.transactionCreated).toBeCalled();
    wrapper.setProps({
      transactions: {
        ...props.transactions,
        transactionsCreated: [{
          id: '123123', senderId: '34234L', recipientId: '2342342L', amount: '0.01',
        }],
        transactionsCreatedFailed: [],
        broadcastedTransactionsError: [],
      },
    });
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });
  it('should call transactionCreated as soon the component load if using HW', () => {
    const newProps = { ...props };
    newProps.account = {
      ...props.account,
      hwInfo: {
        deviceId: '123123sdf',
      },
    };
    wrapper = mount(<Summary {...newProps} />, options);
    wrapper.update();
    expect(props.transactionCreated).toBeCalled();
  });
});
