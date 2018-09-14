import React from 'react';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from '../../../test/utils/mountHelpers';
import TransactionDetailView from './transactionDetailView';
import txTypes from '../../constants/transactionTypes';

describe('TransactionDetailView', () => {
  it('should render 5 rows', () => {
    const context = {
      storeState: {
        peers: {
          data: {},
          options: {},
        },
        transaction: {
          votesName: {},
        },
        voting: { votes: {} },
      },
      middlewares: [thunk],
    };
    const props = {
      prevStep: spy(),
      t: () => {},
      transaction: {
        type: txTypes.send,
        amount: '0',
        senderId: '',
        recipientId: '123L',
        timestamp: '',
        fee: '',
        confirmations: '',
        id: '',
      },
      pendingTransactions: [],
      match: { params: {} },
      history: { push: spy(), location: { search: '' } },
    };
    const wrapper = mountWithContext(<TransactionDetailView {...props} />, context);
    const expectedValue = /grid-row/g;
    const html = wrapper.html();
    expect(html.match(expectedValue)).to.have.lengthOf(5);
    wrapper.find('.transaction-details-back-button').simulate('click');
    expect(props.history.push).to.have.been.calledWith();
  });

  it('should render 4 rows for pendingTransactions', () => {
    const context = {
      storeState: {
        peers: {
          data: {},
          options: {},
        },
        transaction: {
          votesName: {},
        },
        voting: { votes: {} },
      },
      middlewares: [thunk],
    };
    const props = {
      prevStep: spy(),
      t: () => {},
      transaction: '',
      pendingTransactions: [{
        type: txTypes.send,
        amount: '0',
        senderId: '',
        recipientId: '123L',
        timestamp: '',
        fee: '',
        confirmations: '',
        id: '',
      }],
      match: { params: { address: '123L' } },
      history: { push: spy(), location: { search: '' } },
    };
    const wrapper = mountWithContext(<TransactionDetailView {...props} />, context);
    const expectedValue = /grid-row/g;
    const html = wrapper.html();
    expect(html.match(expectedValue)).to.have.lengthOf(4);
    wrapper.find('.transaction-details-back-button').simulate('click');
    expect(props.history.push).to.have.been.calledWith();
  });

  it('should display 2 voter-address Links', () => {
    const transaction = {
      senderId: '',
      recipientId: '123L',
      timestamp: '',
      fee: '',
      confirmations: '',
      id: '',
      type: txTypes.vote,
      amount: '0',
    };
    const context = {
      storeState: {
        peers: {
          data: {},
          options: {},
        },
        transaction: {
          ...transaction,
        },
        voting: { votes: {} },
      },
      middlewares: [thunk],
    };
    const props = {
      prevStep: spy(),
      t: () => {},
      transaction: {
        ...transaction,
        votesName: {
          deleted: [{ account: { address: 123 }, username: 123 }],
          added: [{ account: { address: 123 }, username: 123 }],
        },
      },
      pendingTransactions: [],
      match: { params: {} },
      history: { push: () => {}, location: { search: '' } },
    };
    const wrapper = mountWithContext(<TransactionDetailView {...props} />, context);
    expect(wrapper.find('Link.voter-address')).to.have.lengthOf(2);
  });
});
