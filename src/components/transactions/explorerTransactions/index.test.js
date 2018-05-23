import React from 'react';
import thunk from 'redux-thunk';
import { spy, stub, match } from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { prepareStore } from '../../../../test/utils/applicationInit';
import * as accountAPI from '../../../../src/utils/api/account';
import peersReducer from '../../../store/reducers/peers';
import accountReducer from '../../../store/reducers/account';
import transactionsReducer from '../../../store/reducers/transactions';
import searchReducer from '../../../store/reducers/search';
import loadingReducer from '../../../store/reducers/loading';

import { accountLoggedIn } from '../../../../src/actions/account';
import { activePeerSet } from '../../../../src/actions/peers';
import networks from './../../../../src/constants/networks';
import getNetwork from './../../../../src/utils/getNetwork';

import ExplorerTransactions from './index';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';

describe('ExplorerTransactions Component', () => {
  let wrapper;
  let props;
  let transactionsActionsStub;

  const store = prepareStore({
    peers: peersReducer,
    account: accountReducer,
    transactions: transactionsReducer,
    search: searchReducer,
    loading: loadingReducer,
  }, [thunk]);

  beforeEach(() => {
    transactionsActionsStub = stub(accountAPI, 'transactions');

    props = {
      match: { params: { address: accounts.genesis.address } },
      address: accounts.genesis.address,
      history: { push: spy(), location: { search: ' ' } },
      t: key => key,
    };

    transactionsActionsStub.withArgs({
      activePeer: match.any,
      address: accounts.genesis.address,
      limit: 25,
      filter: undefined,
    }).returnsPromise().resolves({ transactions: [{ id: 'Some ID' }], count: 1000 });

    store.dispatch(accountLoggedIn({
      ...accounts.genesis,
      isDelegate: true,
      delegate: { ...accounts['delegate candidate'] },
    }));

    store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));

    wrapper = mount(<Provider store={store}>
      <Router>
        <ExplorerTransactions {...props} i18n={i18n}/>
      </Router>
    </Provider>);
  });

  afterEach(() => {
    transactionsActionsStub.restore();
  });

  it('renders ExplorerTransactions Component and loads searched account transactions', () => {
    const renderedExplorerTransactions = wrapper.find(ExplorerTransactions);
    expect(renderedExplorerTransactions).to.be.present();
    expect(wrapper).to.have.exactly(1).descendants('.transactions-row');
  });
});
