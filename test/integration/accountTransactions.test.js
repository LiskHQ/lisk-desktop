import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match } from 'sinon';

import * as peers from '../../src/utils/api/peers';
import * as accountAPI from '../../src/utils/api/account';
import * as delegateAPI from '../../src/utils/api/delegate';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import accountReducer from '../../src/store/reducers/account';
import transactionsReducer from '../../src/store/reducers/transactions';
import peersReducer from '../../src/store/reducers/peers';
import loadingReducer from '../../src/store/reducers/loading';
import votingReducer from '../../src/store/reducers/voting';
import transactionReducer from '../../src/store/reducers/transaction';
import searchReducer from '../../src/store/reducers/search';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import votingMiddleware from '../../src/store/middlewares/voting';
import { activePeerSet } from '../../src/actions/peers';
import networks from './../../src/constants/networks';
import txTypes from './../../src/constants/transactionTypes';
import getNetwork from './../../src/utils/getNetwork';
import { accountLoggedIn } from '../../src/actions/account';
import AccountTransactions from './../../src/components/accountTransactions';
import accounts from '../constants/accounts';
import GenericStepDefinition from '../utils/genericStepDefinition';

class Helper extends GenericStepDefinition {
  checkSelectedFilter(filter) {
    const expectedClass = '_active';

    const activeFilter = this.wrapper.find('.transaction-filter-item').filterWhere((item) => {
      const className = item.prop('className');
      return className.includes(expectedClass);
    });

    expect(activeFilter.text().toLowerCase()).to.equal(filter);
  }
}

describe('@integration: Account Transactions', () => {
  let store;
  let helper;
  let wrapper;
  let requestToActivePeerStub;
  let accountAPIStub;
  let delegateAPIStub;
  let transactionAPIStub;

  beforeEach(() => {
    requestToActivePeerStub = stub(peers, 'requestToActivePeer');
    accountAPIStub = stub(accountAPI, 'getAccount');
    transactionAPIStub = stub(accountAPI, 'transaction');
    delegateAPIStub = stub(delegateAPI, 'getDelegate');

    const transactionExample = { senderId: '456L', receiverId: '456L', type: txTypes.send };

    delegateAPIStub.withArgs(match.any).returnsPromise()
      .resolves({ delegate: { ...accounts['delegate candidate'] } });

    // specific address
    let transactions = new Array(20);
    transactions.fill(transactionExample);
    requestToActivePeerStub.withArgs(match.any, 'transactions', match({ senderId: '123L', recipientId: '123L' }))
      .returnsPromise().resolves({ transactions, count: 1000 });
    transactionAPIStub.returnsPromise().resolves({ transaction: {
      id: '123456789', senderId: '123l', recipientId: '456l', votes: { added: [], deleted: [] },
    } });
    // incoming transaction result
    transactions = new Array(15);
    transactions.fill(transactionExample);
    transactions.push({ senderId: 'sample_address', receiverId: 'some_address', type: txTypes.vote });
    requestToActivePeerStub.withArgs(match.any, 'transactions', match({ senderId: undefined }))
      .returnsPromise().resolves({ transactions, count: 1000 });

    // outgoing transaction result
    transactions = new Array(5);
    transactions.fill(transactionExample);
    requestToActivePeerStub.withArgs(match.any, 'transactions', match({ recipientId: undefined }))
      .returnsPromise().resolves({ transactions, count: 1000 });
  });

  afterEach(() => {
    requestToActivePeerStub.restore();
    accountAPIStub.restore();
    delegateAPIStub.restore();
    transactionAPIStub.restore();
    wrapper.update();
  });

  const setupStep = ({ accountType, address }) => {
    store = prepareStore({
      account: accountReducer,
      transactions: transactionsReducer,
      transaction: transactionReducer,
      voting: votingReducer,
      peers: peersReducer,
      loading: loadingReducer,
      search: searchReducer,
    }, [
      thunk,
      accountMiddleware,
      loginMiddleware,
      votingMiddleware,
    ]);

    const account = {
      ...accounts[accountType],
      delegate: {},
      multisignatures: [],
      u_multisignatures: [],
      unconfirmedBalance: '0',
    };

    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
    store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));
    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
    if (accountType) { store.dispatch(accountLoggedIn(account)); }
    wrapper = mount(renderWithRouter(AccountTransactions, store,
      { match: { params: { address } }, history: { location: { search: '' } } }));

    helper = new Helper(wrapper, store);
  };

  describe('Scenario: should allow to view transactions of any account', () => {
    step('Given I\'m on "accounts/123L" as "genesis" account', () => setupStep({ accountType: 'genesis', address: '123L' }));
    step('Then I should see 20 transaction rows as result of the address 123L', () => helper.shouldSeeCountInstancesOf(20, 'TransactionRow'));
    step('When I click on a transaction row', () => helper.clickOnElement('.transactionsRow'));
    step('Then I should be able to see the details of that transaction', () => helper.shouldSeeCountInstancesOf(1, '.transactions-detail-view'));
  });

  describe('Scenario: should allow to filter transactions', () => {
    step('Given I\'m on "wallet" as "genesis" account', () => setupStep({ accountType: 'genesis', address: '123L' }));
    step('Then the "All" filter should be selected by default', () => helper.checkSelectedFilter('all'));
    step('When I click on the "Outgoing" filter', () => helper.clickOnElement('.filter-out'));
    step('Then I expect to see the results for "Outgoing"', () => helper.shouldSeeCountInstancesOf(5, 'TransactionRow'));
    step('When I click on the "Incoming" filter', () => helper.clickOnElement('.filter-in'));
    step('Then I expect to see the results for "Incoming"', () => helper.shouldSeeCountInstancesOf(15, 'TransactionRow'));
    step('When I click again on the "All" filter', () => helper.clickOnElement('.filter-all'));
    step('Then I expect to see the results for "All"', () => helper.shouldSeeCountInstancesOf(20, 'TransactionRow'));
  });

  describe('Scenario: allows to view transactions without login', () => {
    step('Given I\'m on "accounts/123L" with no account', () => setupStep({ address: '123L' }));
    step('Then I should see 20 transaction rows as result of the address 123L', () => helper.shouldSeeCountInstancesOf(20, 'TransactionRow'));
  });
});
