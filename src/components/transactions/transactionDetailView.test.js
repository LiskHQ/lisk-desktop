import React from 'react';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from '../../../test/utils/mountHelpers';
import TransactionDetailView from './transactionDetailView';
import txTypes from '../../constants/transactionTypes';

describe('TransactionDetailView', () => {
  it('should render 6 rows', () => {
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
        senderId: '',
        recipientId: '',
        timestamp: '',
        fee: '',
        confirmations: '',
        id: '',
        amount: 100,
      },
      match: { params: {} },
      history: { push: () => {}, location: { search: '' } },
    };
    const wrapper = mountWithContext(<TransactionDetailView {...props} />, context);
    const expectedValue = /flexboxgrid__row/g;
    const html = wrapper.html();
    expect(html.match(expectedValue)).to.have.lengthOf(4);
    wrapper.find('.transaction-details-back-button').simulate('click');
    expect(props.prevStep).to.have.been.calledWith();
  });

  it('should display 2 voter-address Links', () => {
    const transaction = {
      value: {
        type: txTypes.send,
      },
      senderId: '',
      recipientId: '',
      timestamp: '',
      fee: '',
      confirmations: '',
      id: '',
      amount: 0,
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
          deleted: [{ address: 123, username: 123 }],
          added: [{ address: 123, username: 123 }],
        },
      },
      match: { params: {} },
      history: { push: () => {}, location: { search: '' } },
    };
    const wrapper = mountWithContext(<TransactionDetailView {...props} />, context);
    expect(wrapper.find('Link.voter-address')).to.have.lengthOf(2);
  });
});
