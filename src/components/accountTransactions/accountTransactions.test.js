import React from 'react';
import thunk from 'redux-thunk';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { prepareStore } from '../../../test/unit-test-utils/applicationInit';
import * as search from '../../actions/search';
import peersReducer from '../../store/reducers/peers';
import accountReducer from '../../store/reducers/account';
import searchReducer from '../../store/reducers/search';
import loadingReducer from '../../store/reducers/loading';
import filtersReducer from '../../store/reducers/filters';
import followedAccountsReducer from '../../store/reducers/followedAccounts';

import { liskAPIClientSet } from './../../../src/actions/peers';
import networks from './../../../src/constants/networks';
import getNetwork from './../../../src/utils/getNetwork';

import AccountTransactions from './index';
import i18n from '../../i18n';
import accounts from '../../../test/constants/accounts';
import routes from '../../constants/routes';

import ExplorerTransactionsV2 from '../transactionsV2/explorerTransactionsV2';

describe('AccountTransaction Component', () => {
  let wrapper;
  let props;
  let searchTransactionsSpy;
  let searchAccountSpy;

  const store = prepareStore({
    followedAccounts: followedAccountsReducer,
    peers: peersReducer,
    account: accountReducer,
    search: searchReducer,
    loading: loadingReducer,
    filters: filtersReducer,
  }, [thunk]);

  beforeEach(() => {
    searchTransactionsSpy = spy(search, 'searchTransactions');
    searchAccountSpy = spy(search, 'searchAccount');

    props = {
      match: {
        url: `${routes.accounts.pathPrefix}${routes.accounts.path}/${accounts.genesis.address}`,
        params: { address: accounts.genesis.address },
      },
      history: { push: spy(), location: { search: ' ' } },
      t: key => key,
    };

    store.dispatch(liskAPIClientSet({ network: getNetwork(networks.testnet.code) }));

    wrapper = mount(<Provider store={store}>
      <Router>
        <AccountTransactions {...props} i18n={i18n}/>
      </Router>
    </Provider>);
  });

  afterEach(() => {
    searchTransactionsSpy.restore();
    searchAccountSpy.restore();
  });

  it('renders AccountTransaction Component and loads account transactions', () => {
    const renderedAccountTransactions = wrapper.find(AccountTransactions);
    expect(renderedAccountTransactions).to.be.present();
  });

  it('renders ExplorerTransactionsV2 if is accountsV2 route', () => {
    props = {
      ...props,
      match: {
        url: `${routes.accountsV2.pathPrefix}${routes.accountsV2.path}/${accounts.genesis.address}`,
        params: { address: accounts.genesis.address },
      },
    };

    wrapper = mount(<Provider store={store}>
      <Router>
        <AccountTransactions {...props} i18n={i18n}/>
      </Router>
    </Provider>);

    expect(wrapper).to.have.descendants(ExplorerTransactionsV2);
  });
});
