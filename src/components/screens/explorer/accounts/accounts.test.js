import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Accounts from './accounts';
import accounts from '../../../../../test/constants/accounts';
import routes from '../../../../constants/routes';
import * as hwManager from '../../../../utils/hwManager';
import store from '../../../../store';

jest.mock('../../../../utils/hwManager.js', () => ({
  getAddress: jest.fn(),
}));

const network = {
  network: {
    networks: {
      LSK: { apiVersion: '2' },
    },
  },
};

store.getState = jest.fn().mockImplementation(() => network);

describe('Accounts Component', () => {
  const fakeStore = configureStore()(network);

  const transactions = [{
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
    token: 'LSK',
  }];

  const defaultProps = {
    accounts: {
      [accounts.genesis.address]: accounts.genesis,
    },
    address: accounts.genesis.address,
    account: {
      ...accounts.empty_account,
      loginType: 0,
    },
    match: { params: { address: accounts.genesis.address } },
    history: { push: jest.fn(), location: { search: ' ' } },
    bookmarks: {
      LSK: [],
      BTC: [],
    },
    transactions: {
      data: {
        data: transactions,
        meta: {
          offset: 0,
          count: 1000,
        },
      },
      urlSearchParams: {
        filters: {},
      },
      loadData: jest.fn(),
    },
    transaction: transactions[0],
    getTransactions: jest.fn(),
    loading: [],
    t: key => key,
    wallets: {},
    balance: accounts.genesis.balance,
    detailAccount: {
      data: accounts.genesis,
      loadData: jest.fn(),
    },
    delegate: {
      data: {},
      loadData: jest.fn(),
    },
    hideChart: true, // Props to hide chart on tests, due to no canvas support
    activeToken: 'LSK',
  };

  const mountWithProps = props =>
    mount(<Provider store={fakeStore}><Accounts {...props} /></Provider>);

  describe('Another account', () => {
    it('renders Accounts Component and loads account transactions', () => {
      const wrapper = mountWithProps(defaultProps);
      const renderedWalletTransactions = wrapper.find(Accounts);
      expect(renderedWalletTransactions).toExist();
      expect(wrapper).toContainExactlyOneMatchingElement('div.transactions-row');
    });

    it('click on row transaction', () => {
      const wrapper = mountWithProps(defaultProps);
      const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${transactions[0].id}`;
      wrapper.find('.transactions-row').first().simulate('click');
      expect(defaultProps.history.push).toBeCalledWith(transactionPath);
    });

    it('click on load more', () => {
      const wrapper = mountWithProps(defaultProps);
      expect(wrapper).toContainMatchingElement('.show-more-button');
      wrapper.find('.show-more-button').simulate('click');
      expect(defaultProps.transactions.loadData).toBeCalled();
    });

    it('Should change filters on click', () => {
      const wrapper = mountWithProps(defaultProps);
      expect(wrapper).toContainMatchingElement('.transaction-filter-item');
      wrapper.find('.transaction-filter-item').at(1).simulate('click');
      expect(defaultProps.transactions.loadData).toBeCalled();
    });

    it('click verify address when user use hardware wallet', () => {
      const newProps = {
        ...defaultProps,
        account: {
          ...defaultProps.account,
          loginType: 1,
          hwInfo: {
            deviceId: 'abc123',
            derivationIndex: 1,
          },
        },
      };
      const wrapper = mountWithProps(newProps);
      expect(wrapper).toContainMatchingElement('.verify-address');
      wrapper.find('.verify-address').at(0).simulate('click');
      expect(hwManager.getAddress).toBeCalled();
    });
  });

  describe('Delegate account', () => {
    const delegateProps = {
      ...defaultProps,
      accounts: {
        [accounts.delegate.address]: accounts.delegate,
      },
      address: accounts.delegate.address,
      account: accounts.genesis,
      match: { params: { address: accounts.delegate.address } },
      balance: accounts.delegate.balance,
      detailAccount: {
        ...defaultProps.detailAccount,
        data: {
          ...accounts.delegate,
          delegate: {
            username: accounts.genesis.username,
          },
        },
      },
      delegate: {
        data: {
          account: accounts.delegate,
          approval: 98.63,
          missedBlocks: 10,
          producedBlocks: 304,
          productivity: 96.82,
          rank: 1,
          rewards: '140500000000',
          username: accounts.delegate.username,
          vote: '9876965713168313',
          lastBlock: 0,
          txDelegateRegister: { timestamp: 0 },
        },
      },
    };

    it('Should render delegate Tab', () => {
      const wrapper = mountWithProps(delegateProps);
      expect(wrapper).toContainExactlyOneMatchingElement('TabsContainer');
      expect(wrapper.find('TabsContainer')).toContainMatchingElement('.delegateStats');
    });
  });

  describe('BTC account', () => {
    it('should not render VotesTab', () => {
      const wrapper = mountWithProps({ ...defaultProps, activeToken: 'BTC' });
      expect(wrapper).toContainExactlyOneMatchingElement('TabsContainer');
      expect(wrapper.find('TabsContainer')).not.toContainMatchingElement('VotesTab');
    });
  });
});
