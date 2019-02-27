import React from 'react';
import PropTypes from 'prop-types';
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
    lastTransaction: transaction,
    wallets: {},
    loadLastTransaction: jest.fn(),
    peers: { options: { code: 0 } },
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<WalletDetails {...props} />, options);
  });

  it('Should render with passed props', () => {
    const expectedBalance = '99,800,000 LSK';
    const expectedLastTx = '+695.5 LSK';
    expect(wrapper.find('.account-balance .value')).toHaveText(expectedBalance);
    expect(wrapper.find('.last-transaction .value')).toHaveText(expectedLastTx);
  });

  describe('Last transaction', () => {
    it('Last transaction must have - sign if outgoing transaction', () => {
      wrapper.setProps({
        lastTransaction: {
          ...transaction,
          senderId: accounts.genesis.address,
          recipientId: '12345L',
        },
      });
      const expectedLastTx = '-695.6 LSK';
      expect(wrapper.find('.last-transaction .value')).toHaveText(expectedLastTx);
    });

    it('Last transaction must have no sign if self transaction', () => {
      wrapper.setProps({
        lastTransaction: {
          ...transaction,
          senderId: accounts.genesis.address,
        },
      });
      const expectedLastTx = '695.6 LSK';
      expect(wrapper.find('.last-transaction .value')).toHaveText(expectedLastTx);
    });

    it('If no last transaction render as "-"', () => {
      wrapper.setProps({ lastTransaction: {} });
      const expectedLastTx = '-';
      expect(wrapper.find('.last-transaction .value')).toHaveText(expectedLastTx);
    });

    it('Should update last transaction if balance is different from previous one', () => {
      wrapper.setProps({ balance: accounts.genesis.balance + 10 });
      wrapper.update();
      expect(props.loadLastTransaction).toBeCalledWith(props.address);
    });
  });

  describe('Since last visit', () => {
    it('Should render "-" if no last balance saved or empty localStorage wallets item', () => {
      const expectedDifference = '-';
      const walletProps = {
        ...props,
        wallets: { mainnet: { [accounts.genesis.address]: { balance: 0 } } },
      };
      expect(wrapper.find('.last-visit .value')).toHaveText(expectedDifference);
      wrapper = mount(<WalletDetails {...walletProps} />, options);
      expect(wrapper.find('.last-visit .value')).toHaveText(expectedDifference);
    });

    it('Should render difference from previous visit', () => {
      let walletProps = {
        ...props,
        balance: 0,
        wallets: { mainnet: { [accounts.genesis.address]: { lastBalance: 1000000000 } } },
      };
      let expectedDifference = '-10 LSK';
      wrapper = mount(<WalletDetails {...walletProps} />, options);
      expect(wrapper.find('.last-visit .value')).toHaveText(expectedDifference);

      walletProps = {
        ...props,
        balance: 1000000000,
        wallets: { mainnet: { [accounts.genesis.address]: { lastBalance: 0 } } },
      };
      expectedDifference = '+10 LSK';
      wrapper = mount(<WalletDetails {...walletProps} />, options);
      expect(wrapper.find('.last-visit .value')).toHaveText(expectedDifference);
    });
  });
});
