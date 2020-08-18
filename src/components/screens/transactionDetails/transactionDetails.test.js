import Lisk from '@liskhq/lisk-client';
import React from 'react';
import { mount } from 'enzyme';
import TransactionDetails from './transactionDetails';
import accounts from '../../../../test/constants/accounts';
import fees from '../../../constants/fees';
import transactionTypes from '../../../constants/transactionTypes';
import routes from '../../../constants/routes';
import { mountWithRouter } from '../../../utils/testHelpers';

describe('Single Transaction Component', () => {
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
      fee: fees.send,
      timestamp: Date.now(),
    },
  };
  const voteTransaction = {
    data: {
      type: transactionTypes().vote.code,
      amount: '0',
      fee: Lisk.transaction.constants.VOTE_FEE.toString(),
      senderId: accounts.genesis.address,
      recipientId: accounts.delegate.address,
      timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - 100,
      asset: {
        votes: [
          accounts.delegate.publicKey,
          accounts.delegate_candidate.publicKey,
        ].map(publicKey => `+${publicKey}`),
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
      url: `/explorer/transactions/${transaction.id}`,
    },
  };

  describe('Transfer transactions', () => {
    it('Should render transaction details after transaction loaded', () => {
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction },
        { pathname: '/explorer/transactions', id: transaction.id },
      );
      expect(wrapper.find('header h1')).toHaveText('Transaction details');
      expect(wrapper.find('.transaction-id .copy-title').first().text().trim()).toBe(`${transaction.data.id}`);
    });

    it('Should redirect to dashboard if activeToken changes', () => {
      const wrapper = mount(<TransactionDetails {...props} />);
      wrapper.setProps({
        ...props,
        activeToken: 'BTC',
      });
      expect(props.history.push).toHaveBeenCalledWith(routes.dashboard.path);
    });

    it('Should load delegate names after vote transaction loading finished', () => {
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: voteTransaction },
        { pathname: '/explorer/transactions', id: transaction.id },
      );
      wrapper.update();
      expect(props.delegates.loadData).toHaveBeenCalledWith({
        publicKeys: [
          accounts.delegate.publicKey,
          accounts.delegate_candidate.publicKey,
        ],
      });
    });

    it('Should render transfer transaction with message (LSK)', () => {
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction },
        { pathname: '/explorer/transactions', id: transaction.id },
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
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, activeToken: 'BTC', transaction: delegateTx },
        { pathname: '/explorer/transactions', id: transaction.id },
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
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: voteTx },
        { pathname: '/explorer/transactions', id: transaction.id },
      );
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('.accountInfo .label').text()).toBe('Voter');
    });
  });

  describe('2nd Passphrase transaction', () => {
    it('Should render register 2nd passphrase details', () => {
      const secondPassTx = {
        data: {
          type: 1,
          senderId: accounts.genesis.address,
          recipientId: '',
          amount: 0,
          id: 123,
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: secondPassTx },
        { pathname: '/explorer/transactions', id: transaction.id },
      );
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('.accountInfo .label').text()).toBe('Account');
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
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: delegateRegTx },
        { pathname: '/explorer/transactions', id: transaction.id },
      );
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
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
});
