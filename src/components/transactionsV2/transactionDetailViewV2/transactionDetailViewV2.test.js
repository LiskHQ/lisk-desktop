import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import i18n from '../../../i18n';
import TransactionDetailViewV2 from './transactionDetailViewV2';
import accounts from '../../../../test/constants/accounts';

describe('Transaction Detail View V2', () => {
  let wrapper;
  const options = {
    context: { i18n },
  };

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
      wrapper = mount(<Router><TransactionDetailViewV2 {...props} /></Router>, options);
      expect(wrapper).toContainMatchingElement('.summaryHeader');
      expect(wrapper).toContainMatchingElements(2, '.accountInfo');
      expect(wrapper.find('.accountInfo .sender-address').first().text()).toBe(transaction.senderId);
      expect(wrapper.find('.accountInfo .receiver-address').at(1).text()).toBe(transaction.recipientId);
      expect(wrapper).toContainExactlyOneMatchingElement('.message');
    });

    it('Should render transfer transaction without message', () => {
      props.transaction.asset = {};
      wrapper = mount(<Router><TransactionDetailViewV2 {...props} /></Router>, options);
      expect(wrapper).not.toContainMatchingElement('.message');
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
      wrapper = mount(<Router><TransactionDetailViewV2 {...props} /></Router>, options);
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('.accountInfo .label').text()).toBe('Registrant');
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
      wrapper = mount(<Router><TransactionDetailViewV2 {...props} /></Router>, options);
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('.summaryHeader p').text()).toBe(transaction.asset.delegate.username);
    });
  });
});
