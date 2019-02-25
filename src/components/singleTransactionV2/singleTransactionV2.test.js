import React from 'react';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import SingleTransactionV2 from './singleTransactionV2';
import accounts from '../../../test/constants/accounts';
import fees from '../../constants/fees';

jest.useFakeTimers();

describe('Single Transaction V2 Component', () => {
  let wrapper;
  const commonProps = {
    address: accounts.genesis.address,
    peers: { liskAPIClient: {} },
    match: {
      params: {
        id: 123,
      },
    },
    loadTransaction: jest.fn(),
  };
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
      fee: fees.send,
      timestamp: Date.now(),
    };
    const props = {
      ...commonProps,
      transaction,
      t: v => v,
    };

    beforeEach(() => {
      wrapper = mount(<SingleTransactionV2 {...props} />, options);
    });

    it('Should render transfer transaction', () => {
      expect(wrapper.find('.detailsHeader h1').text()).toBe('Transfer Transaction');
      expect(wrapper.find('.transaction-id').first().text().trim()).toBe(`${transaction.id}`);
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
    const props = {
      ...commonProps,
      transaction,
      t: v => v,
    };

    it('Should render 2nd passphrase transaction', () => {
      wrapper = mount(<SingleTransactionV2 {...props} />, options);
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
    const props = {
      ...commonProps,
      transaction,
      t: v => v,
    };

    it('Should render delegate registration transaction', () => {
      wrapper = mount(<SingleTransactionV2 {...props} />, options);
      expect(wrapper.find('.detailsHeader h1')).toHaveText('Delegate Registration');
    });
  });

  describe('Votes transactions', () => {
    const transaction = {
      senderId: accounts.genesis.address,
      confirmation: 1,
      type: 2,
      id: 123,
      fee: fees.vote,
      timestamp: Date.now(),
      voteNames: { added: [{ username: 'test', rank: 1 }] },
    };
    const props = {
      ...commonProps,
      transaction,
      t: v => v,
    };

    it('Should render votes transaction', () => {
      wrapper = mount(<SingleTransactionV2 {...props} />, options);
      expect(wrapper.find('.detailsHeader h1')).toHaveText('Delegate Registration');
    });
  });
});
