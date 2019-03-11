import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import TransactionStatus from './transactionStatus';

describe('TransactionStatus', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    history: {
      location: {
        path: '/wallet/sendV2/send',
        search: '?recipient=16313739661670634666L&amount=10&reference=test',
      },
      push: jest.fn(),
    },
    transactions: {
      failed: undefined,
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
    finalCallback: jest.fn(),
    failedTransactions: undefined,
    transactionFailedClear: jest.fn(),
    prevStep: jest.fn(),
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
  };

  beforeEach(() => {
    wrapper = mount(<TransactionStatus {...props} />, options);
  });

  it('should render properly transactionStatus', () => {
    expect(wrapper).toContainMatchingElement('.transaction-status');
    expect(wrapper).toContainMatchingElement('.transaction-status-content');
    expect(wrapper).toContainMatchingElement('.transaction-status-footer');
    expect(wrapper).not.toContainMatchingElement('.transaction-status-error');
  });

  it('should call finalCallback function', () => {
    wrapper.find('.on-goToWallet').at(0).simulate('click');
    wrapper.update();
    expect(props.finalCallback).toBeCalled();
  });

  it('should render error message in case of transaction failed', () => {
    const newProps = { ...props };
    newProps.failedTransactions = [{ recipient: '123L', amount: 1, reference: 'test' }];
    wrapper = mount(<TransactionStatus {...newProps} />, options);
    expect(wrapper).toContainMatchingElement('.transaction-status-error');
    wrapper.find('.on-goToWallet').at(0).simulate('click');
    wrapper.update();
    expect(props.finalCallback).toBeCalled();
  });

  it('should call onPrevStep function', () => {
    const newProps = { ...props };
    newProps.fields.isHardwareWalletConnected = true;
    newProps.fields.hwTransactionStatus = 'error';
    newProps.failedTransactions = [{ recipient: '123L', amount: 1, reference: 'test' }];
    wrapper = mount(<TransactionStatus {...newProps} />, options);
    expect(wrapper).toContainMatchingElement('.transaction-status-error');
    wrapper.find('.retry').at(0).simulate('click');
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });
});
