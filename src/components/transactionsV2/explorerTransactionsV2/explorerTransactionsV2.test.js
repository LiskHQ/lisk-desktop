import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import ExplorerTransactionsV2 from './explorerTransactionsV2';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';
import routes from '../../../constants/routes';

describe('ExplorerTransactions V2 Component', () => {
  let wrapper;
  const peers = {
    data: {},
    options: {},
    liskAPIClient: {},
  };

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
  }];

  const store = configureMockStore([thunk])({
    peers,
    account: accounts.genesis,
    followedAccounts: {
      accounts: [],
    },
    settings: {},
  });

  const options = {
    context: {
      store, i18n,
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    accounts: {
      [accounts.genesis.address]: accounts.genesis,
    },
    address: accounts.genesis.address,
    account: accounts['empty account'],
    match: { params: { address: accounts.genesis.address } },
    history: { push: jest.fn(), location: { search: ' ' } },
    followedAccounts: [],
    count: 1000,
    transactions,
    transaction: transactions[0],
    searchAccount: jest.fn(),
    searchTransactions: jest.fn(),
    transactionsFilterSet: jest.fn(),
    searchMoreTransactions: jest.fn(),
    addFilter: jest.fn(),
    loading: [],
    t: key => key,
    loadLastTransaction: jest.fn(),
    wallets: {},
    peers: { options: { code: 0 } },
    balance: accounts.genesis.balance,
    detailAccount: accounts.genesis,
  };

  describe('Another account', () => {
    beforeEach(() => {
      wrapper = mount(<Router>
          <ExplorerTransactionsV2 {...props} />
        </Router>, options);
    });

    it('renders ExplorerTransactionsV2 Component and loads account transactions', () => {
      const renderedWalletTransactions = wrapper.find(ExplorerTransactionsV2);
      expect(renderedWalletTransactions).toExist();
      expect(wrapper).toContainExactlyOneMatchingElement('div.transactions-row');
    });

    it('click on row transaction', () => {
      const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${transactions[0].id}`;
      wrapper.find('.transactions-row').first().simulate('click');
      expect(props.history.push).toBeCalledWith(transactionPath);
    });

    it('click on load more', () => {
      expect(wrapper).toContainMatchingElement('.show-more-button');
      wrapper.find('.show-more-button').simulate('click');
      expect(props.searchMoreTransactions).toBeCalled();
    });

    it('Should change filters on click', () => {
      expect(wrapper).toContainMatchingElement('.transaction-filter-item');
      wrapper.find('.transaction-filter-item').at(1).simulate('click');
      expect(props.addFilter).toBeCalled();
    });
  });

  describe('Delegate account', () => {
    const delegateProps = {
      ...props,
      accounts: {
        [accounts.delegate.address]: accounts.delegate,
      },
      address: accounts.delegate.address,
      account: accounts.genesis,
      match: { params: { address: accounts.delegate.address } },
      balance: accounts.delegate.balance,
      detailAccount: accounts.delegate,
      delegate: {
        account: accounts.delegate,
        approval: 98.63,
        missedBlocks: 10,
        producedBlocks: 304,
        productivity: 96.82,
        rank: 1,
        rewards: '140500000000',
        username: accounts.delegate.username,
        vote: '9876965713168313',
        lastBlock: { timestamp: 0 },
        txDelegateRegister: { timestamp: 0 },
      },
    };

    beforeEach(() => {
      wrapper = mount(<Router>
        <ExplorerTransactionsV2 {...delegateProps} />
      </Router>, options);
    });

    it('Should render delegate Tab', () => {
      expect(wrapper).toContainExactlyOneMatchingElement('TabsContainer');
      expect(wrapper.find('TabsContainer')).toContainMatchingElement('.delegateStats');
    });
  });
});
