import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import WalletDetails from './walletDetails';

describe('Wallet Details Module', () => {
  let wrapper;

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const transaction = {
    id: '11327666066806006572',
    type: 0,
    timestamp: 15647029,
    senderId: '5201600508578320196L',
    recipientId: accounts.genesis.address,
    amount: 69550000000,
    fee: 10000000,
    confirmations: 4314504,
    address: '12345678L',
    asset: {},
  };

  const props = {
    address: accounts.genesis.address,
    balance: accounts.genesis.balance,
    transactions: [transaction],
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<WalletDetails {...props} />, options);
  });

  it('Should render with passed props', () => {
    const expectedBalance = '99,800,000 LSK';
    const expectedLastTx = '+695.5 LSK';
    expect(wrapper.find('.account-balance .value')).to.have.text(expectedBalance);
    expect(wrapper.find('.last-transaction .value')).to.have.text(expectedLastTx);
  });

  it('Last transaction must have - sign if outgoing transaction', () => {
    wrapper.setProps({
      transactions: [{
        ...transaction,
        senderId: accounts.genesis.address,
        recipientId: '12345L',
      }],
    });
    const expectedLastTx = '-695.5 LSK';
    expect(wrapper.find('.last-transaction .value')).to.have.text(expectedLastTx);
  });

  it('Last transaction must have no sign if self transaction', () => {
    wrapper.setProps({
      transactions: [{
        ...transaction,
        senderId: accounts.genesis.address,
      }],
    });
    const expectedLastTx = '695.5 LSK';
    expect(wrapper.find('.last-transaction .value')).to.have.text(expectedLastTx);
  });

  it('If no last transaction render as 0 LSK', () => {
    wrapper.setProps({ transactions: [] });
    const expectedLastTx = '0 LSK';
    expect(wrapper.find('.last-transaction .value')).to.have.text(expectedLastTx);
  });
});
