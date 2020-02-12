import Lisk from '@liskhq/lisk-client-old';
import React from 'react';
import { mount } from 'enzyme';
import Transactions from './transactions';
import accounts from '../../../../../test/constants/accounts';
import fees from '../../../../constants/fees';
import transactionTypes from '../../../../constants/transactionTypes';

describe('Single Transaction Component', () => {
  let wrapper;
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
    fee: fees.send,
    timestamp: Date.now(),
  };
  const voteTransaction = {
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
    beforeEach(() => {
      wrapper = mount(<Transactions {...props} />);
    });

    it('Should render transaction details after transaciton loaded', () => {
      wrapper.setProps({
        ...props,
        transaction: {
          data: transaction,
          isLoading: false,
        },
      });
      expect(wrapper.find('header h1')).toHaveText('Transaction details');
      expect(wrapper.find('.transaction-id .copy-title').first().text().trim()).toBe(`${transaction.id}`);
    });

    it('Should redirect to dashboard if activeToken changes', () => {
      wrapper.setProps({
        ...props,
        activeToken: 'BTC',
      });
      expect(props.history.push).toHaveBeenCalledWith('/dashboard');
    });

    it('Should load delegate names after vote transaction loading finished', () => {
      wrapper.setProps({
        ...props,
        transaction: {
          data: voteTransaction,
          isLoading: false,
        },
      });
      expect(props.delegates.loadData).toHaveBeenCalledWith({
        publicKey: accounts.delegate.publicKey,
      });
      expect(props.delegates.loadData).toHaveBeenCalledWith({
        publicKey: accounts.delegate_candidate.publicKey,
      });
    });
  });

  describe('No results', () => {
    it('Should render no result screen', () => {
      wrapper = mount(<Transactions {...{
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
