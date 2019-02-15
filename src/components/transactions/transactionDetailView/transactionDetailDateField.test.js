import React from 'react';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from '../../../../test/unit-test-utils/mountHelpers';
import DateField from './transactionDetailDateField';
import txTypes from '../../../constants/transactionTypes';

describe('transactionDetailDateField', () => {
  it('should render date span no timestamp', () => {
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
    const wrapper = mountWithContext(<DateField {...props} />, context);
    const expectedValue = /span/g;
    const html = wrapper.html();
    expect(html.match(expectedValue)).to.have.lengthOf(2);
  });

  it('should render date span with timestamp', () => {
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
        timestamp: 75694160,
        fee: '',
        confirmations: '',
        id: '',
      },
      pendingTransactions: [],
      match: { params: {} },
      history: { push: spy(), location: { search: '' } },
    };
    const wrapper = mountWithContext(<DateField {...props} />, context);
    const expectedValue = /span/g;
    const html = wrapper.html();
    expect(html.match(expectedValue)).to.have.lengthOf(6);
  });
});
