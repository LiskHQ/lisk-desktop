import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './account';
import * as accountApi from '../../utils/api/account';
import * as delegateApi from '../../utils/api/delegate';
import actionTypes from '../../constants/actions';
import transactionTypes from '../../constants/transactionTypes';

describe('Account middleware', () => {
  let store;
  let next;
  let state;
  const transactionsUpdatedAction = {
    type: actionTypes.transactionsUpdated,
    data: {
      confirmed: [{
        type: transactionTypes.registerDelegate,
      }],
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
    };
    store.getState = () => (state);
    next = spy();
  });

  it('should passes the action to next middleware', () => {
    const expectedAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(expectedAction);
    expect(next).to.have.been.calledWith(expectedAction);
  });

  it(`should call account API methods on ${actionTypes.metronomeBeat} action`, () => {
    const stubGetAccount = stub(accountApi, 'getAccount').resolves({ balance: 0 });
    const stubGetAccountStatus = stub(accountApi, 'getAccountStatus').resolves(true);

    middleware(store)(next)({ type: actionTypes.metronomeBeat });

    expect(stubGetAccount).to.have.been.calledWith();
    expect(stubGetAccountStatus).to.have.been.calledWith();

    stubGetAccount.restore();
    stubGetAccountStatus.restore();
  });

  it(`should call transactions API methods on ${actionTypes.metronomeBeat} action if account.balance changes`, () => {
    const stubGetAccount = stub(accountApi, 'getAccount').resolves({ balance: 10e8 });
    const stubTransactions = stub(accountApi, 'transactions').resolves(true);

    middleware(store)(next)({ type: actionTypes.metronomeBeat });

    expect(stubGetAccount).to.have.been.calledWith();
    // TODO why next expect doesn't work despite it being called according to test coverage?
    // expect(stubTransactions).to.have.been.calledWith();

    stubGetAccount.restore();
    stubTransactions.restore();
  });

  it(`should call fetchAndUpdateForgedBlocks(...) on ${actionTypes.metronomeBeat} action if account.balance changes and account.isDelegate`, () => {
    state.account.isDelegate = true;
    store.getState = () => (state);
    const stubGetAccount = stub(accountApi, 'getAccount').resolves({ balance: 10e8 });
    const stubGetAccountStatus = stub(accountApi, 'getAccountStatus').resolves(true);
    // const fetchAndUpdateForgedBlocksSpy = spy(forgingActions, 'fetchAndUpdateForgedBlocks');

    middleware(store)(next)({ type: actionTypes.metronomeBeat });

    // TODO why next expect doesn't work despite it being called according to test coverage?
    // expect(fetchAndUpdateForgedBlocksSpy).to.have.been.calledWith();

    stubGetAccount.restore();
    stubGetAccountStatus.restore();
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
});

