import React from 'react';
import { mount } from 'enzyme';
import TransactionDetails from './transactionDetails';
import accounts from '../../../../test/constants/accounts';
// import transactionTypes from '../../../constants/transactionTypes';
import { mountWithRouter } from '../../../utils/testHelpers';
import transactionTypes from '../../../constants/transactionTypes';

describe('Transaction Details Component', () => {
  const transaction = {
    data: {
      senderId: accounts.genesis.address,
      recipientId: accounts.delegate.address,
      amount: 100000,
      asset: {
        data: 'Transaction message',
      },
      confirmation: 1,
      type: 0,
      id: 123,
      fee: 1e7,
      timestamp: Date.now(),
      title: 'transfer',
    },
  };
  const voteTransaction = {
    data: {
      type: transactionTypes().vote.code.new,
      amount: '0',
      fee: 1e8,
      senderId: accounts.genesis.address,
      recipientId: accounts.delegate.address,
      timestamp: 1499983200,
      title: 'vote',
      asset: {
        votes: [
          {
            address: '123456789L',
            username: 'saample',
            amount: '10000000000',
          },
        ],
      },
    },
  };

  const props = {
    t: v => v,
    history: {
      push: jest.fn(),
      replace: jest.fn(),
      createHref: jest.fn(),
    },
    activeToken: 'LSK',
    transaction: {
      data: {},
      isLoading: true,
    },
    delegates: {
      data: {},
      loadData: jest.fn(),
    },
    match: {
      url: `/transactions/${transaction.id}`,
    },
    votedDelegates: {
      data: {},
      loadData: jest.fn(),
    },
  };

  describe('Transfer transactions', () => {
    it('Should render transaction details after transaction loaded', () => {
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction },
        { id: transaction.id },
      );
      expect(wrapper.find('header h1')).toHaveText('Transaction details');
      expect(wrapper.find('.transaction-id .copy-title').first().text().trim()).toBe(`${transaction.data.id}`);
    });

    it('Should load delegate names after vote transaction loading finished', () => {
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: voteTransaction },
        { id: transaction.id },
      );
      expect(wrapper.find('VoteItem')).toHaveLength(1);
    });

    it('Should render transfer transaction with message (LSK)', () => {
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction },
        { id: transaction.id },
      );
      expect(wrapper).toContainMatchingElements(2, '.accountInfo');
      expect(wrapper.find('.accountInfo .sender-address').text()).toBe(transaction.data.senderId);
      expect(wrapper.find('.accountInfo .receiver-address').text()).toBe(transaction.data.recipientId);
      expect(wrapper).toContainExactlyOneMatchingElement('.tx-reference');
    });

    it('Should not render transfer transaction with message (BTC)', () => {
      const wrapper = mount(<TransactionDetails {...props} activeToken="BTC" />);
      expect(wrapper).not.toContain('.tx-reference');
    });

    it('Should show the delegate name if the sender is a Lisk delegate', () => {
      const delegateTx = {
        data: {
          type: 3,
          senderId: accounts.genesis.address,
          recipientId: '',
          amount: 0,
          id: 123,
          asset: {
            delegate: { username: 'genesis' },
            votes: [
              accounts.delegate.publicKey,
              accounts.delegate_candidate.publicKey,
            ].map(publicKey => `+${publicKey}`),
          },
          title: 'vote',
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, activeToken: 'BTC', transaction: delegateTx },
        { id: transaction.id },
      );
      expect(wrapper).not.toContain('genesis');
    });
  });

  describe('Delegate vote transaction', () => {
    it('Should render delegate vote details', () => {
      const voteTx = {
        data: {
          type: 3,
          senderId: accounts.genesis.address,
          recipientId: '',
          amount: 0,
          id: 123,
          asset: {
            votes: [],
          },
          title: 'vote',
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: voteTx },
        { id: transaction.id },
      );
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('.accountInfo .label').text()).toBe('Voter');
    });
  });

  describe('Register delegate transaction', () => {
    it('Should render register delegate details', () => {
      const delegateRegTx = {
        data: {
          type: 2,
          senderId: accounts.delegate.address,
          recipientId: '',
          amount: 0,
          asset: { delegate: accounts.delegate },
          id: 123,
          title: 'registerDelegate',
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: delegateRegTx },
        { id: transaction.id },
      );
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('DelegateUsername')).toHaveLength(1);
    });
  });

  describe('No results', () => {
    it('Should render no result screen', () => {
      const wrapper = mount(<TransactionDetails {...{
        ...props,
        transaction: {
          error: 'INVALID_REQUEST_PARAMETER',
          data: {},
        },
      }}
      />);
      expect(wrapper).toContainMatchingElement('NotFound');
    });
  });

  describe('Unlock transaction', () => {
    it('Should render unlock LSK details', () => {
      const unlockTx = {
        data: {
          type: 14,
          senderId: accounts.genesis.address,
          recipientId: '',
          id: 123,
          asset: {
            unlockingObjects: [
              {
                amount: 100,
              }, {
                amount: 20,
              },
              {
                amount: -10,
              },
            ],
          },
          title: 'unlockToken',
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: unlockTx },
        { id: transaction.id },
      );
      expect(wrapper).toContainMatchingElement('.transaction-image');
      expect(wrapper.find('.tx-header').text()).toEqual(transactionTypes().unlockToken.title);
      expect(wrapper).toContainMatchingElement('.transaction-id');
      expect(wrapper).toContainMatchingElement('.tx-amount');
      expect(wrapper).toContainMatchingElement('.tx-fee');
    });
  });
});
