import React from 'react';
import thunk from 'redux-thunk';
import { spy, useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import ExplorerTransactionsV2 from './explorerTransactionsV2';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';
import routes from '../../../constants/routes';

describe('WalletTransactions V2 Component', () => {
  let wrapper;
  let props;

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

  beforeEach(() => {
    props = {
      accounts: {
        [accounts.genesis.address]: accounts.genesis,
      },
      address: accounts.genesis.address,
      account: accounts['empty account'],
      match: { params: { address: accounts.genesis.address } },
      history: { push: spy(), location: { search: ' ' } },
      followedAccounts: [],
      count: 1000,
      transactions,
      searchAccount: spy(),
      searchTransactions: spy(),
      transactionsFilterSet: spy(),
      searchMoreTransactions: spy(),
      addFilter: spy(),
      loading: [],
      t: key => key,
    };

    wrapper = mount(<Router>
        <ExplorerTransactionsV2 {...props} />
      </Router>, options);
  });

  it('renders ExplorerTransactionsV2 Component and loads account transactions', () => {
    const renderedWalletTransactions = wrapper.find(ExplorerTransactionsV2);
    expect(renderedWalletTransactions).to.be.present();
    expect(wrapper).to.have.exactly(1).descendants('.transactions-row');
  });

  it('click on row transaction', () => {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${transactions[0].id}`;
    wrapper.find('.transactions-row').first().simulate('click');
    expect(props.history.push).to.have.been.calledWith(transactionPath);
  });

  it('click on load more', () => {
    expect(wrapper).to.have.descendants('.show-more-button');
    wrapper.find('.show-more-button').simulate('click');
    expect(props.searchMoreTransactions).to.have.been.calledWith();
  });

  it('Should change filters on click', () => {
    expect(wrapper).to.have.descendants('.transaction-filter-item');
    wrapper.find('.transaction-filter-item').at(1).simulate('click');
    expect(props.addFilter).to.have.been.calledWith();
  });
});
