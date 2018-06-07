import thunk from 'redux-thunk';
import { step } from 'mocha-steps';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, match, spy } from 'sinon';

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
import routes from '../../src/constants/routes';
import GenericStepDefinition from '../utils/genericStepDefinition';

const delegateProductivity = {
  producedblocks: 43961,
  missedblocks: 283,
  rate: 2,
  rank: 2,
  approval: 35.27,
  productivity: 99.36,
};

describe('@integration: Account Transactions', () => {
  let store;
  let helper;
  let wrapper;
  let requestToActivePeerStub;
  let accountAPIStub;
  let delegateAPIStub;
  let votesAPIStub;
  let votersAPIStub;
  let transactionAPIStub;
  let explorerTransactionsProps;

  const history = {
    location: {
      search: '',
      pathname: '',
    },
    push: spy(),
  };

  class Helper extends GenericStepDefinition {
    checkSelectedFilter(filter) {
      const expectedClass = '_active';
      const activeFilter = this.wrapper.find('.transaction-filter-item').filterWhere((item) => {
        const className = item.prop('className');
        return className.includes(expectedClass);
      });
      expect(activeFilter.text().toLowerCase()).to.equal(filter);
    }
    checkDelegateDetails() {
      expect(this.wrapper.find('.approval').first()).to.have.text(`Approval${delegateProductivity.approval}%`);
      expect(this.wrapper.find('.rank').first()).to.have.text(`Rank / Status${delegateProductivity.rank} / Active`);
      expect(this.wrapper.find('.productivity').first()).to.have.text(`Uptime${delegateProductivity.productivity}%`);
    }
    countLinks(expectedNumber) {
      expect(this.wrapper.find('.voters Link')).to.have.length(expectedNumber);
    }
    // eslint-disable-next-line class-methods-use-this
    checkRedirectionToDetails(address, transactionId) {
      expect(explorerTransactionsProps.history.push).to.have.been.calledWith(`${routes.accounts.pathPrefix}${routes.accounts.path}/${address}?id=${transactionId}`);
    }
  }

  const voters = [{
    username: null,
    address: '3484156157234038617L',
    publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
    balance: '0',
  }, {
    username: null,
    address: '1234038617L',
    publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
    balance: '0',
  }];

  const votes = [{
    username: 'liskpool_com_01',
    address: '14593474056247442712L',
    publicKey: 'ec111c8ad482445cfe83d811a7edd1f1d2765079c99d7d958cca1354740b7614',
    vote: '4257396024977439',
    producedblocks: 43961,
    missedblocks: 283,
    rate: 2,
    rank: 2,
    approval: 35.27,
    productivity: 99.36,
  }, {
    username: 'test123',
    address: '14593474056247442712L',
    publicKey: 'ec111c8ad482445cfe83d811a7edd1f1d2765079c99d7d958cca1354740b7614',
    vote: '4257396024977439',
    producedblocks: 43961,
    missedblocks: 283,
    rate: 2,
    rank: 2,
    approval: 35.27,
    productivity: 99.36,
  }];

  beforeEach(() => {
    requestToActivePeerStub = stub(peers, 'requestToActivePeer');
    accountAPIStub = stub(accountAPI, 'getAccount');
    transactionAPIStub = stub(accountAPI, 'transaction');
    delegateAPIStub = stub(delegateAPI, 'getDelegate');
    votesAPIStub = stub(delegateAPI, 'getVotes');
    votersAPIStub = stub(delegateAPI, 'getVoters');

    const transactionExample = {
      senderId: '456L', receiverId: '456L', type: txTypes.send, id: '123456',
    };

    delegateAPIStub.withArgs(match.any).returnsPromise()
      .resolves({
        delegate: {
          ...accounts['delegate candidate'],
          ...delegateProductivity,
          address: '123L',
        },
      });

    let transactions = new Array(20);

    // specific address
    transactions.fill(transactionExample);
    requestToActivePeerStub.withArgs(match.any, 'transactions', match({ senderId: '123L', recipientId: '123L' }))
      .returnsPromise().resolves({ transactions, count: 1000 });
    transactionAPIStub.returnsPromise().resolves({
      transaction: {
        id: '123456789', senderId: '123l', recipientId: '456l', votes: { added: [], deleted: [] },
      },
    });
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
    votesAPIStub.restore();
    votersAPIStub.restore();
    wrapper.update();
  });

  const setupStep = ({ accountType, address }, accountExtraProps = {}) => {
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
      ...accountExtraProps,
    };

    votesAPIStub.withArgs(match.any).returnsPromise()
      .resolves({ delegates: votes });
    votersAPIStub.withArgs(match.any).returnsPromise()
      .resolves({ accounts: voters });

    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
    store.dispatch(activePeerSet({ network: getNetwork(networks.mainnet.code) }));
    accountAPIStub.withArgs(match.any).returnsPromise().resolves({ ...account });
    if (accountType) { store.dispatch(accountLoggedIn(account)); }
    wrapper = mount(renderWithRouter(
      AccountTransactions, store,
      { match: { params: { address } }, history },
    ));

    explorerTransactionsProps = wrapper.find('ExplorerTransactions').props();
    explorerTransactionsProps.history.push = spy();
    helper = new Helper(wrapper, store);
  };

  describe('Scenario: should allow to view transactions details of any account', () => {
    step('Given I\'m on "accounts/123L" as "genesis" account', () => setupStep({ accountType: 'genesis', address: '123L' }));
    step('Then I should see 20 transaction rows as result of the address 123L', () => helper.shouldSeeCountInstancesOf(20, 'TransactionRow'));
    step('When I click on a transaction row', () => helper.clickOnElement('.transactions-row'));
    step('Then I should be redirected to transactoinDetails step', () => helper.checkRedirectionToDetails('123L', '123456'));
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

  describe('Scenario: allows to load more cache transactions of an account', () => {
    step('Given I\'m on "accounts/123L" with no account', () => setupStep({ address: '123L' }));
    step('Then I should see 20 transaction rows as result of the address 123L', () => helper.shouldSeeCountInstancesOf(20, 'TransactionRow'));
    step('When I scroll to the bottom of "transactions box"', () => { wrapper.find('Waypoint').props().onEnter(); });
    step('Then I should see 40 transaction rows as result of the address 123L', () => helper.shouldSeeCountInstancesOf(40, 'TransactionRow'));
  });

  describe('Scenario: should allow to view delegate details of a delegate account', () => {
    step('Given I\'m on "accounts/123L" as "genesis" account', () => setupStep({ accountType: 'genesis', address: '123L' }, { isDelegate: true }));
    step('When I click on the "delegate-statistics" filter', () => helper.clickOnElement('.delegate-statistics'));
    step('Then I should see the delegate statistics details rendered', () => helper.checkDelegateDetails());
    step('Then I should see 2 voters', () => helper.countLinks(2));
    step('When I fill voters filter input', () => helper.fillInputField('123', 'voters'));
    step('Then I should see 1 voter', () => helper.countLinks(1));
  });
});
