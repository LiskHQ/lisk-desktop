import { expect } from 'chai';
import {
  spy, stub, useFakeTimers, match,
} from 'sinon';
import * as accountActions from '../../actions/account';
import * as transactionsActions from '../../actions/transactions';
import * as votingActions from '../../actions/voting';
import * as networkActions from '../../actions/network';
import * as accountApi from '../../utils/api/account';
import * as transactionsApi from '../../utils/api/lsk/transactions';
import * as accountUtils from '../../utils/login';
import accounts from '../../../test/constants/accounts';
import networks from '../../constants/networks';
import settings from '../../constants/settings';
import actionTypes from '../../constants/actions';
import middleware from './account';
import transactionTypes from '../../constants/transactionTypes';

describe('Account middleware', () => {
  let store;
  let next;
  let state;
  let stubGetAccount;
  let stubTransactions;
  let transactionsActionsStub;
  let getAutoLogInDataMock;
  let networkSetMock;
  let accountDataUpdatedSpy;
  const liskAPIClientMock = 'DUMMY_LISK_API_CLIENT';
  const storeCreatedAction = {
    type: actionTypes.storeCreated,
  };

  const { passphrase } = accounts.genesis;

  const transactions = { transactions: [{ senderId: 'sample_address', receiverId: 'some_address' }] };

  const transactionsUpdatedAction = {
    type: actionTypes.updateTransactions,
    data: {
      confirmed: [{
        type: transactionTypes.registerDelegate,
        confirmations: 1,
      }],
    },
  };

  const newBlockCreated = {
    type: actionTypes.newBlockCreated,
    data: {
      windowIsFocused: true,
      block: transactions,
    },
  };

  let clock;

  beforeEach(() => {
    clock = useFakeTimers(new Date('2017-12-29').getTime());
    store = stub();
    store.dispatch = spy();
    state = {
      network: {
        status: { online: true },
        name: 'Custom Node',
        networks: {
          LSK: {
            nodeUrl: 'hhtp://localhost:4000',
            nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
          },
        },
      },
      account: {
        address: 'sample_address',
        info: {
          LSK: {
            address: 'sample_address',
          },
        },
      },
      transactions: {
        pending: [{
          id: 12498250891724098,
        }],
        confirmed: [],
        account: { address: 'test_address', balance: 0 },
      },
      delegate: {},
      settings: { token: {} },
    };
    store.getState = () => (state);

    next = spy();
    spy(accountActions, 'updateTransactionsIfNeeded');
    spy(accountActions, 'updateDelegateAccount');
    stubGetAccount = stub(accountApi, 'getAccount').returnsPromise();
    transactionsActionsStub = spy(transactionsActions, 'updateTransactions');
    stubTransactions = stub(transactionsApi, 'getTransactions').returnsPromise().resolves(true);
    getAutoLogInDataMock = stub(accountUtils, 'getAutoLogInData');
    getAutoLogInDataMock.withArgs().returns({ });
    networkSetMock = stub(networkActions, 'networkSet').returns(liskAPIClientMock);
    accountDataUpdatedSpy = spy(accountActions, 'accountDataUpdated');
  });

  afterEach(() => {
    accountActions.updateDelegateAccount.restore();
    accountActions.updateTransactionsIfNeeded.restore();
    transactionsActionsStub.restore();
    stubGetAccount.restore();
    stubTransactions.restore();
    clock.restore();
    getAutoLogInDataMock.restore();
    networkSetMock.restore();
    accountDataUpdatedSpy.restore();
  });

  it('should pass the action to next middleware', () => {
    middleware(store)(next)(newBlockCreated);
    expect(next).to.have.been.calledWith(newBlockCreated);
  });

  it(`should call account API methods on ${actionTypes.newBlockCreated} action when online`, () => {
    middleware(store)(next)(newBlockCreated);

    const data = {
      windowIsFocused: true,
      account: state.account,
      transactions: state.transactions,
    };

    clock.tick(7000);
    expect(accountDataUpdatedSpy).to.have.been.calledWith(data);
    expect(accountActions.updateTransactionsIfNeeded).to.have.been.calledWith();
  });

  it(`should call account BTC API methods on ${actionTypes.newBlockCreated} action when BTC is the active token`, () => {
    state.settings = { token: { active: 'BTC' } };
    const account = { address: 'n45uoyzDvep8cwgkfxq3H3te1ujWyu1kkB' };
    state.account = account;
    middleware(store)(next)(newBlockCreated);

    clock.tick(7000);
    expect(accountActions.updateTransactionsIfNeeded)
      .to.have.been.calledWith(match({ account }));
  });

  it(`should call API methods on ${actionTypes.newBlockCreated} action if state.transaction.transactions.confirmed does not contain recent transaction. Case with transactions address`, () => {
    store.getState = () => ({
      ...state,
      transactions: {
        ...state.transactions,
        confirmed: [{ confirmations: 10 }],
        address: 'sample_address',
      },
    });

    middleware(store)(next)(newBlockCreated);

    clock.tick(7000);
    expect(accountDataUpdatedSpy).to.have.been.calledWith();
  });

  it(`should call API methods on ${actionTypes.newBlockCreated} action if state.transaction.transactions.confirmed does not contain recent transaction. Case with confirmed address`, () => {
    store.getState = () => ({
      ...state,
      transactions: {
        pending: [{
          id: 12498250891724098,
        }],
        confirmed: [{ confirmations: 10, address: 'sample_address' }],
      },
      network: {
        status: { online: true },
        name: 'Custom Node',
        networks: {
          LSK: {
            nodeUrl: 'hhtp://localhost:4000',
            nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
          },
        },
      },
    });

    middleware(store)(next)(newBlockCreated);

    clock.tick(7000);
    expect(accountDataUpdatedSpy).to.have.been.calledWith();
  });

  it(`should dispatch ${actionTypes.loadVotes} action on ${actionTypes.updateTransactions} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    const actionSpy = spy(votingActions, 'loadVotes');
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes.vote;
    middleware(store)(next)(transactionsUpdatedAction);
    expect(actionSpy).to.have.been.calledWith({
      address: state.account.address,
      type: 'update',
    });
  });

  it(`should dispatch ${actionTypes.networkSet} action on ${actionTypes.storeCreated} if autologin data found in localStorage`, async () => {
    getAutoLogInDataMock.withArgs().returns({
      [settings.keys.loginKey]: passphrase,
      [settings.keys.liskCoreUrl]: networks.testnet.nodes[0],
    });
    await middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).to.have.been.calledWith();
  });

  it(`should do nothing on ${actionTypes.storeCreated} if autologin data NOT found in localStorage`, () => {
    middleware(store)(next)(storeCreatedAction);
    expect(store.dispatch).to.not.have.been.calledWith(liskAPIClientMock);
  });

  it(`should clean up on ${actionTypes.accountLoggedOut} `, () => {
    const accountLoggedOutAction = {
      type: actionTypes.accountLoggedOut,
    };
    middleware(store)(next)(accountLoggedOutAction);
    expect(store.dispatch).to.have.been.calledWith({ type: actionTypes.cleanTransactions });
  });
});
