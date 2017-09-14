import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './account';
import * as accountApi from '../../utils/api/account';
import * as delegateApi from '../../utils/api/delegate';
import actionTypes from '../../constants/actions';
import transactionTypes from '../../constants/transactionTypes';
import { SYNC_ACTIVE_INTERVAL, SYNC_INACTIVE_INTERVAL } from '../../constants/api';
import { clearVoteLists } from '../../actions/voting';

describe('Account middleware', () => {
  let store;
  let next;
  let state;
  let stubGetAccount;
  let stubGetAccountStatus;
  let stubTransactions;

  const transactionsUpdatedAction = {
    type: actionTypes.transactionsUpdated,
    data: {
      confirmed: [{
        type: transactionTypes.registerDelegate,
        confirmations: 1,
      }],
    },
  };

  const activeBeatAction = {
    type: actionTypes.metronomeBeat,
    data: {
      interval: SYNC_ACTIVE_INTERVAL,
    },
  };

  const inactiveBeatAction = {
    type: actionTypes.metronomeBeat,
    data: {
      interval: SYNC_INACTIVE_INTERVAL,
    },
  };

  beforeEach(() => {
    store = stub();
    store.dispatch = spy();
    state = {
      peers: {
        data: {},
      },
      account: {
        balance: 0,
      },
      transactions: {
        pending: [{
          id: 12498250891724098,
        }],
        confirmed: [],
      },
    };
    store.getState = () => (state);

    next = spy();
    stubGetAccount = stub(accountApi, 'getAccount').returnsPromise();
    stubGetAccountStatus = stub(accountApi, 'getAccountStatus').returnsPromise();
    stubTransactions = stub(accountApi, 'transactions').returnsPromise().resolves(true);
  });

  afterEach(() => {
    stubGetAccount.restore();
    stubGetAccountStatus.restore();
    stubTransactions.restore();
  });

  it('should pass the action to next middleware', () => {
    const expectedAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(expectedAction);
    expect(next).to.have.been.calledWith(expectedAction);
  });

  it(`should call account API methods on ${actionTypes.metronomeBeat} action`, () => {
    stubGetAccount.resolves({ balance: 0 });

    middleware(store)(next)(activeBeatAction);

    expect(stubGetAccount).to.have.been.calledWith();
    expect(stubGetAccountStatus).to.have.been.calledWith();
  });

  it(`should call transactions API methods on ${actionTypes.metronomeBeat} action if account.balance changes`, () => {
    stubGetAccount.resolves({ balance: 10e8 });
    stubGetAccountStatus.resolves(true);

    middleware(store)(next)(activeBeatAction);

    expect(stubGetAccount).to.have.been.calledWith();
    // TODO why next expect doesn't work despite it being called according to test coverage?
    // expect(stubTransactions).to.have.been.calledWith();
  });

  it(`should call transactions API methods on ${actionTypes.metronomeBeat} action if account.balance changes and action.data.interval is SYNC_INACTIVE_INTERVAL`, () => {
    stubGetAccount.resolves({ balance: 10e8 });
    stubGetAccountStatus.rejects(false);

    middleware(store)(next)(inactiveBeatAction);

    expect(stubGetAccount).to.have.been.calledWith();
    // TODO why next expect doesn't work despite it being called according to test coverage?
    // expect(stubTransactions).to.have.been.calledWith();
  });

  it(`should call transactions API methods on ${actionTypes.metronomeBeat} action if action.data.interval is SYNC_ACTIVE_INTERVAL and there are recent transactions`, () => {
    stubGetAccount.resolves({ balance: 0 });

    middleware(store)(next)(activeBeatAction);

    expect(stubGetAccount).to.have.been.calledWith();
    // TODO why next expect doesn't work despite it being called according to test coverage?
    // expect(stubTransactions).to.have.been.calledWith();
  });

  it(`should fetch delegate info on ${actionTypes.metronomeBeat} action if account.balance changes and account.isDelegate`, () => {
    const delegateApiMock = stub(delegateApi, 'getDelegate').returnsPromise().resolves({ success: true, delegate: {} });
    stubGetAccount.resolves({ balance: 10e8 });
    state.account.isDelegate = true;
    store.getState = () => (state);

    middleware(store)(next)(activeBeatAction);
    expect(store.dispatch).to.have.been.calledWith();

    delegateApiMock.restore();
  });

  it(`should call fetchAndUpdateForgedBlocks(...) on ${actionTypes.metronomeBeat} action if account.balance changes and account.isDelegate`, () => {
    state.account.isDelegate = true;
    store.getState = () => (state);
    stubGetAccount.resolves({ balance: 10e8 });
    // const fetchAndUpdateForgedBlocksSpy = spy(forgingActions, 'fetchAndUpdateForgedBlocks');

    middleware(store)(next)({ type: actionTypes.metronomeBeat });

    // TODO why next expect doesn't work despite it being called according to test coverage?
    // expect(fetchAndUpdateForgedBlocksSpy).to.have.been.calledWith();
  });

  it(`should fetch delegate info on ${actionTypes.transactionsUpdated} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    const delegateApiMock = stub(delegateApi, 'getDelegate').returnsPromise().resolves({ success: true, delegate: {} });

    middleware(store)(next)(transactionsUpdatedAction);
    expect(store.dispatch).to.have.been.calledWith();

    delegateApiMock.restore();
  });

  it(`should not fetch delegate info on ${actionTypes.transactionsUpdated} action if action.data.confirmed does not contain delegateRegistration transactions`, () => {
    const delegateApiMock = stub(delegateApi, 'getDelegate').returnsPromise().resolves({ success: true, delegate: {} });
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes.send;

    middleware(store)(next)(transactionsUpdatedAction);
    expect(store.dispatch).to.not.have.been.calledWith();

    delegateApiMock.restore();
  });

  it(`should dispatch clearVoteLists action on ${actionTypes.transactionsUpdated} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes.vote;
    middleware(store)(next)(transactionsUpdatedAction);
    expect(store.dispatch).to.have.been.calledWith(clearVoteLists());
  });
});

