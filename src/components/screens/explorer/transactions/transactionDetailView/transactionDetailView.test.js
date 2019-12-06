import React from 'react';
import { mount } from 'enzyme';
import TransactionDetailView from './transactionDetailView';
import accounts from '../../../../../../test/constants/accounts';

describe('Transaction Detail View', () => {
  let wrapper;
  describe('Transfer transactions', () => {
    const transaction = {
      senderId: accounts.genesis.address,
      recipientId: accounts.delegate.address,
      amount: 100000,
      asset: {
        data: 'Transaction message',
      },
      confirmation: 1,
      type: 0,
      id: 123,
    };
    const props = {
      transaction,
      t: v => v,
    };

    it('Should render transfer transaction with message', () => {
      wrapper = mount(<TransactionDetailView {...props} />);
      expect(wrapper).toContainMatchingElements(2, '.accountInfo');
      expect(wrapper.find('.accountInfo .sender-address').text()).toBe(transaction.senderId);
      expect(wrapper.find('.accountInfo .receiver-address').text()).toBe(transaction.recipientId);
      expect(wrapper).toContainExactlyOneMatchingElement('.tx-reference');
    });
  });

  describe('Delegate vote transaction', () => {
    const transaction = {
      type: 3,
      senderId: accounts.genesis.address,
      recipientId: '',
      amount: 0,
      id: 123,
    };
    const props = {
      transaction,
      t: v => v,
    };

    it('Should render delegate vote details', () => {
      wrapper = mount(<TransactionDetailView {...props} />);
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('.accountInfo .label').text()).toBe('Voter');
    });
  });

  describe('2nd Passphrase transaction', () => {
    const transaction = {
      type: 1,
      senderId: accounts.genesis.address,
      recipientId: '',
      amount: 0,
      id: 123,
    };
    const props = {
      transaction,
      t: v => v,
    };

    it('Should render register 2nd passphrase details', () => {
      wrapper = mount(<TransactionDetailView {...props} />);
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('.accountInfo .label').text()).toBe('Account');
    });
  });

  describe('Register delegate transaction', () => {
    const transaction = {
      type: 2,
      senderId: accounts.delegate.address,
      recipientId: '',
      amount: 0,
      asset: { delegate: accounts.delegate },
      id: 123,
    };
    const props = {
      transaction,
      t: v => v,
    };

    it('Should render register delegate details', () => {
      wrapper = mount(<TransactionDetailView {...props} />);
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      // commented out while waiting for answer to whether this should be kept in place
      // https://projects.invisionapp.com/d/main#/console/17570736/368355792/comments/118391923
      // expect(wrapper.find('.summaryHeader p').text()).toBe(transaction.asset.delegate.username);
    });
  });
});
