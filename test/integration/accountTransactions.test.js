import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match } from 'sinon';

import * as peers from '../../src/utils/api/peers';
import * as accountAPI from '../../src/utils/api/account';
import { prepareStore, renderWithRouter } from '../utils/applicationInit';
import accountReducer from '../../src/store/reducers/account';
import transactionReducer from '../../src/store/reducers/transactions';
import peersReducer from '../../src/store/reducers/peers';
import loginMiddleware from '../../src/store/middlewares/login';
import accountMiddleware from '../../src/store/middlewares/account';
import transactionsMiddleware from '../../src/store/middlewares/transactions';
import { activePeerSet } from '../../src/actions/peers';
import networks from './../../src/constants/networks';
import txTypes from './../../src/constants/transactionTypes';
import getNetwork from './../../src/utils/getNetwork';
import { accountLoggedIn } from '../../src/actions/account';
import AccountTransactions from './../../src/components/accountTransactions';
import accounts from '../constants/accounts';
import { click } from './steps';

describe('@integration: Account Transactions', () => {
  let store;
  let wrapper;
  let requestToActivePeerStub;
  let accountAPIStub;

  beforeEach(() => {
    requestToActivePeerStub = stub(peers, 'requestToActivePeer');
    accountAPIStub = stub(accountAPI, 'getAccount');

    const transactionExample = { senderId: '456L', receiverId: '456L', type: txTypes.send };

    // specific address
    let transactions = new Array(20);
    transactions.fill(transactionExample);
    requestToActivePeerStub.withArgs(match.any, 'transactions', match({ senderId: '123L', recipientId: '123L' }))
      .returnsPromise().resolves({ transactions, count: 1000 });

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
    wrapper.update();
  });

  const setupStep = ({ accountType, address }) => {
    store = prepareStore({
      account: accountReducer,
      transactions: transactionReducer,
      peers: peersReducer,
    }, [
      thunk,
      accountMiddleware,
      loginMiddleware,
      transactionsMiddleware,
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
      { match: { params: { address } } }));
  };

  const clickStep = (elementName) => {
    click(wrapper, elementName);
  };

  const checkRowCount = (length) => {
    expect(wrapper.find('TransactionRow')).to.have.length(length);
  };

  const checkSelectedFilter = (filter) => {
    const expectedClass = '_active';

    const activeFilter = wrapper.find('.transaction-filter-item').filterWhere((item) => {
      const className = item.prop('className');
      return className.includes(expectedClass);
    });

    expect(activeFilter.text().toLowerCase()).to.equal(filter);
  };

  describe('Scenario: should allow to view transactions of any account', () => {
    step('Given I\'m on "accounts/123L" as "genesis" account', setupStep.bind(null, { accountType: 'genesis', address: '123L' }));
    step('Then I should see 20 transaction rows as result of the address 123L', checkRowCount.bind(null, 20));
  });

  describe('Scenario: should allow to filter transactions', () => {
    step('Given I\'m on "wallet" as "genesis" account', setupStep.bind(null, { accountType: 'genesis', address: '123L' }));
    step('Then the "All" filter should be selected by default', checkSelectedFilter.bind(null, 'all'));
    step('When I click on the "Outgoing" filter', clickStep.bind(null, 'filter out'));
    step('Then I expect to see the results for "Outgoing"', checkRowCount.bind(null, 5));
    step('When I click on the "Incoming" filter', clickStep.bind(null, 'filter in'));
    step('Then I expect to see the results for "Incoming"', checkRowCount.bind(null, 15));
    step('When I click again on the "All" filter', clickStep.bind(null, 'filter all'));
    step('Then I expect to see the results for "All"', checkRowCount.bind(null, 20));
  });

  describe('Scenario: allows to view transactions without login', () => {
    step('Given I\'m on "accounts/123L" with no account', setupStep.bind(null, { address: '123L' }));
    step('Then I should see 20 transaction rows as result of the address 123L', checkRowCount.bind(null, 20));
  });
});
