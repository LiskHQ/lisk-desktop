import React from 'react';
import thunk from 'redux-thunk';
import { spy, stub, match } from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { prepareStore } from '../../../../test/utils/applicationInit';
import * as delegateAPI from '../../../../src/utils/api/delegate';
import * as transactionsAPI from '../../../../src/utils/api/transactions';
import peersReducer from '../../../store/reducers/peers';
import accountReducer from '../../../store/reducers/account';
import transactionsReducer from '../../../store/reducers/transactions';
import searchReducer from '../../../store/reducers/search';
import loadingReducer from '../../../store/reducers/loading';
import filtersReducer from '../../../store/reducers/filters';

import { accountLoggedIn } from '../../../../src/actions/account';
import { activePeerSet } from '../../../../src/actions/peers';
import networks from './../../../../src/constants/networks';
import getNetwork from './../../../../src/utils/getNetwork';

import WalletTransactions from './index';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';
import txFilters from './../../../../src/constants/transactionFilters';

describe('WalletTransactions Component', () => {
  let wrapper;
  let props;
  let transactionsActionsStub;
  let delegateVotesStub;
  let delegateVotersStub;

  const store = prepareStore({
    peers: peersReducer,
    account: accountReducer,
    transactions: transactionsReducer,
    search: searchReducer,
    loading: loadingReducer,
    filters: filtersReducer,
  }, [thunk]);

  beforeEach(() => {
    transactionsActionsStub = stub(transactionsAPI, 'getTransactions');
    delegateVotesStub = stub(delegateAPI, 'getVotes');
    delegateVotersStub = stub(delegateAPI, 'getVoters');

    delegateVotesStub.returnsPromise().resolves({ delegates: [accounts['delegate candidate']] });
    delegateVotersStub.returnsPromise().resolves({ accounts: [accounts['empty account']] });

    props = {
      match: { params: { address: accounts.genesis.address } },
      history: { push: spy(), location: { search: ' ' } },
      t: key => key,
    };

    transactionsActionsStub.withArgs({
      activePeer: match.any,
      address: accounts.genesis.address,
      limit: 25,
      filter: txFilters.all,
    }).returnsPromise().resolves({ transactions: [{ id: 'Some ID' }], count: 1000 });


    transactionsActionsStub.withArgs({
      activePeer: match.any,
      address: match.any,
      limit: 25,
      filter: txFilters.statistics,
    }).returnsPromise().resolves({ transactions: [{ id: 'Some ID' }], count: 1000 });

    store.dispatch(accountLoggedIn({
      ...accounts.genesis,
      isDelegate: true,
      delegate: { ...accounts['delegate candidate'] },
    }));

    store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));

    wrapper = mount(<Provider store={store}>
      <Router>
        <WalletTransactions {...props} i18n={i18n}/>
      </Router>
    </Provider>);
  });

  afterEach(() => {
    transactionsActionsStub.restore();
    delegateVotesStub.restore();
    delegateVotersStub.restore();
  });

  it('renders WalletTransaction Component and loads account transactions', () => {
    const renderedWalletTransactions = wrapper.find(WalletTransactions);
    expect(renderedWalletTransactions).to.be.present();
    expect(wrapper).to.have.exactly(1).descendants('.transactions-row');
  });

  it('loads votes and voters for a delegate account', () => {
    wrapper.find('.delegate-statistics').first().simulate('click');
    wrapper.update();
    expect(wrapper.find('.votes-value').first()).to.have.text(`Votes of an account (${1})`);
    expect(wrapper.find('.voters-value').first()).to.have.text(`Who voted for a delegate (${1})`);
  });
});
