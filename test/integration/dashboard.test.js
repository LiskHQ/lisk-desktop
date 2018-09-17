import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { stub, match, spy } from 'sinon';

import * as accountAPI from '../../src/utils/api/account';
import * as delegateAPI from '../../src/utils/api/delegate';
import * as liskServiceAPI from '../../src/utils/api/liskService';
import * as transactionsAPI from '../../src/utils/api/transactions';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import accountReducer from '../../src/store/reducers/account';
import followedAccountsReducer from '../../src/store/reducers/followedAccounts';
import transactionsReducer from '../../src/store/reducers/transactions';
import searchReducer from '../../src/store/reducers/search';
import peersReducer from '../../src/store/reducers/peers';
import loadingReducer from '../../src/store/reducers/loading';
import settingsReducer from '../../src/store/reducers/settings';
import liskServiceReducer from '../../src/store/reducers/liskService';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import followedAccountsMiddleware from '../../src/store/middlewares/followedAccounts';
import peerMiddleware from '../../src/store/middlewares/peers';
import { accountLoggedIn } from '../../src/actions/account';
import { activePeerSet } from '../../src/actions/peers';
import networks from './../../src/constants/networks';
import txTypes from './../../src/constants/transactionTypes';
import routes from '../../src/constants/routes';
import getNetwork from './../../src/utils/getNetwork';
import Dashboard from '../../src/components/dashboard';
import CurrencyGraph from '../../src/components/dashboard/currencyGraph';
import accounts from '../constants/accounts';
import GenericStepDefinition from '../utils/genericStepDefinition';
import EmptyState from '../../src/components/emptyState';
import TransactionRow from '../../src/components/transactions/transactionRow';
import QuickTips from '../../src/components/quickTips';
import NewsFeed from '../../src/components/newsFeed';

describe('@integration: Dashboard', () => {
  let store;
  let wrapper;
  let getTransactionsStub;
  let accountAPIStub;
  let delegateAPIStub;
  let liskServiceAPIStub;
  let helper;
  let sendTransactionsStub;

  const history = { push: spy(), location: { search: '' } };

  class Helper extends GenericStepDefinition {
    clickOnTransaction() {
      this.wrapper.find('TransactionRow').at(0).simulate('click');
      expect(history.push).to.have.been.calledWith(`${routes.wallet.path}?id=10385202636`);
    }
  }

  const generateTransactions = (n) => {
    const transactionExample = {
      id: 10385202636, senderId: 'sample_address', receiverId: 'some_address', type: txTypes.send,
    };
    const transactions = new Array(n);
    transactions.fill(transactionExample);
    return transactions;
  };

  beforeEach(() => {
    getTransactionsStub = stub(transactionsAPI, 'getTransactions');
    liskServiceAPIStub = stub(liskServiceAPI, 'getCurrencyGraphData');
    accountAPIStub = stub(accountAPI, 'getAccount');
    delegateAPIStub = stub(delegateAPI, 'getDelegate');
    sendTransactionsStub = stub(transactionsAPI, 'send');

    sendTransactionsStub.withArgs(
      match.defined,
      match.defined,
      match.defined,
      match.defined,
      match.defined,
      '',
    ).returnsPromise().resolves({ data: [] });
    // transactionsFilterSet do pass filter
    getTransactionsStub.withArgs(match.any)
      .returnsPromise().resolves({ data: generateTransactions(25), meta: { count: 1000 } });

    // rest of accounts send request
    sendTransactionsStub.withArgs(
      match.defined,
      match.defined,
      match.defined,
      match.defined,
      null,
      '',
    ).returnsPromise().resolves({ data: [] });
  });

  afterEach(() => {
    getTransactionsStub.restore();
    liskServiceAPIStub.restore();
    accountAPIStub.restore();
    delegateAPIStub.restore();
    sendTransactionsStub.restore();
  });

  const setupStep = (accountType, options = { isLocked: false, isLoggedIn: true }) => {
    store = prepareStore({
      account: accountReducer,
      transactions: transactionsReducer,
      peers: peersReducer,
      loading: loadingReducer,
      liskService: liskServiceReducer,
      search: searchReducer,
      settings: settingsReducer,
      followedAccounts: followedAccountsReducer,
    }, [
      thunk,
      accountMiddleware,
      loginMiddleware,
      peerMiddleware,
      followedAccountsMiddleware,
    ]);

    const passphrase = options.isLocked ? undefined : accounts[accountType].passphrase;
    const account = {
      ...accounts[accountType],
      delegate: {},
      multisignatures: [],
      u_multisignatures: [],
      unconfirmedBalance: '0',
      passphrase,
    };
    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ data: [...account] });
    store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));
    delegateAPIStub.withArgs(match.any).returnsPromise()
      .resolves({ delegate: { ...accounts['delegate candidate'] } });

    liskServiceAPIStub.withArgs(match.any).returnsPromise()
      .resolves({
        body: {
          candles: [{ timestamp: 111111111 }, { timestamp: 11111111112 }],
        },
      });

    if (options.isLoggedIn) {
      store.dispatch(accountLoggedIn(account));
    }

    wrapper = mount(renderWithRouter(Dashboard, store, { history }));
    helper = new Helper(wrapper, store);
  };

  describe('QuickTips', () => {
    describe('Scenario: should display QuickTips on Dashboard even loggedIn', () => {
      step('Given I\'m on not Logged in', () => setupStep('genesis', { isLoggedIn: false }));
      step('Then I should see 1 instance of "quickTips"', () => helper.shouldSeeCountInstancesOf(1, NewsFeed));
    });

    describe('Scenario: should display QuickTips on Dashboard even logout', () => {
      step('Given I\'m on not Logged in', () => setupStep('genesis'));
      step('Then I should see 1 instance of "quickTips"', () => helper.shouldSeeCountInstancesOf(1, NewsFeed));
    });
  });

  describe('Transactions', () => {
    describe('Scenario: should allow to view transactions', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('Then I should see 5 rows', () => helper.shouldSeeCountInstancesOf(5, 'TransactionRow'));
      step('Then I click on one of the transactions and expect to get directed to its details', () => helper.clickOnTransaction());
    });

    describe('Scenario: should not display Transactions', () => {
      step('Given I\'m on "wallet" as "genesis" account not Logged in', () => setupStep('genesis', { isLoggedIn: false }));
      step('Then I should see 0 instances of "send box"', () => helper.shouldSeeCountInstancesOf(0, TransactionRow));
      step('Then I should see 1 instance of "quickTips"', () => helper.shouldSeeCountInstancesOf(1, QuickTips));
    });
  });

  describe('Currency Graph', () => {
    describe('Scenario: displays the currency graph', () => {
      step('Given I\'m on "wallet" as "genesis" account', () => setupStep('genesis'));
      step('Then I should see the currency graph', () => helper.shouldSeeCountInstancesOf(1, CurrencyGraph));
      step('When I click on "step"', () => helper.clickOnElement('.step'));
      step('Then I should still see the currency graph', () => helper.shouldSeeCountInstancesOf(0, EmptyState));
    });
  });
});
