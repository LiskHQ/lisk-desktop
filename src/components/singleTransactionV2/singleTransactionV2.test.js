import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import i18n from '../../i18n';
import SingleTransactionV2 from './index';
import accounts from '../../../test/constants/accounts';
import fees from '../../constants/fees';

jest.useFakeTimers();

describe('Single Transaction V2 Component', () => {
  let wrapper;
  const peers = { liskAPIClient: {} };

  const props = {
    match: { params: { id: 123 } },
    t: v => v,
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
      fee: fees.send,
      timestamp: Date.now(),
    };

    const store = configureMockStore([thunk])({
      account: accounts.genesis,
      transaction,
      peers,
      loadTransaction: jest.fn(),
    });

    const options = {
      context: { i18n, store },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };

    beforeEach(() => {
      wrapper = mount(<Router><SingleTransactionV2 {...props} /></Router>, options);
    });

    it('Should render transfer transaction', () => {
      expect(wrapper.find('.detailsHeader h1')).toHaveText('Transfer Transaction');
      expect(wrapper.find('.transaction-id .copy-title').first().text().trim()).toBe(`${transaction.id}`);
    });

    it('Should copy ID on clicking on transaction ID', () => {
      wrapper.find('.transaction-id').first().simulate('click');
      expect(wrapper.find('.transaction-id').first()).toHaveText('Copied!');
      jest.advanceTimersByTime(3000);
      expect(wrapper.find('.transaction-id').first()).not.toHaveText('Copied!');
    });

    it('Should copy tx Link on clicking on Copy transction link', () => {
      wrapper.find('.tx-link').first().simulate('click');
      expect(wrapper.find('.tx-link').first()).toHaveText('Copied!');
      jest.advanceTimersByTime(3000);
      expect(wrapper.find('.tx-link').first()).not.toHaveText('Copied!');
    });
  });

  describe('2nd passphrase registration transactions', () => {
    const transaction = {
      senderId: accounts.genesis.address,
      confirmation: 1,
      type: 1,
      id: 123,
      fee: fees.setSecondPassphrase,
      timestamp: Date.now(),
    };
    const store = configureMockStore([thunk])({
      account: accounts.genesis,
      transaction,
      peers,
      loadTransaction: jest.fn(),
    });

    const options = {
      context: { i18n, store },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };

    it('Should render 2nd passphrase transaction', () => {
      wrapper = mount(<Router><SingleTransactionV2 {...props} /></Router>, options);
      expect(wrapper.find('.detailsHeader h1')).toHaveText('2nd Passphrase Registration');
    });
  });

  describe('Delegate registration transactions', () => {
    const transaction = {
      senderId: accounts.genesis.address,
      confirmation: 1,
      type: 2,
      id: 123,
      fee: fees.registerDelegate,
      timestamp: Date.now(),
    };
    const store = configureMockStore([thunk])({
      account: accounts.genesis,
      transaction,
      peers,
      loadTransaction: jest.fn(),
    });

    const options = {
      context: { i18n, store },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };

    it('Should render delegate registration transaction', () => {
      wrapper = mount(<Router><SingleTransactionV2 {...props} /></Router>, options);
      expect(wrapper.find('.detailsHeader h1')).toHaveText('Delegate Registration');
    });
  });

  describe('Votes transactions', () => {
    const transaction = {
      senderId: accounts.genesis.address,
      confirmation: 1,
      type: 3,
      id: 123,
      fee: fees.vote,
      timestamp: Date.now(),
      voteNames: { added: [{ username: 'test', rank: 1 }] },
    };
    const store = configureMockStore([thunk])({
      account: accounts.genesis,
      transaction,
      peers,
      loadTransaction: jest.fn(),
    });

    const options = {
      context: { i18n, store },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };

    it('Should render votes transaction', () => {
      wrapper = mount(<Router><SingleTransactionV2 {...props} /></Router>, options);
      expect(wrapper.find('.detailsHeader h1')).toHaveText('Vote Transaction');
    });
  });
});
