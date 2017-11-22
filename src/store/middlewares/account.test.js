import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { accountUpdated } from '../../actions/account';
import { activePeerUpdate } from '../../actions/peers';
import * as votingActions from '../../actions/voting';
import * as forgingActions from '../../actions/forging';
import * as accountApi from '../../utils/api/account';
import actionTypes from '../../constants/actions';
import * as delegateApi from '../../utils/api/delegate';
import middleware from './account';
import transactionTypes from '../../constants/transactionTypes';

describe('Account middleware', () => {
  let store;
  let next;
  let state;
  let stubGetAccount;
  let stubTransactions;
  const passphrase = 'right cat soul renew under climb middle maid powder churn cram coconut';

  const transactions = { transactions: [{ senderId: 'sample_address', receiverId: 'some_address' }] };

  const transactionsUpdatedAction = {
    type: actionTypes.transactionsUpdated,
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

  const inactiveNewBlockCreated = {
    type: actionTypes.newBlockCreated,
    data: {
      windowIsFocused: false,
      block: transactions,
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
        address: 'sample_address',
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
    stubTransactions = stub(accountApi, 'transactions').returnsPromise().resolves(true);
  });

  afterEach(() => {
    stubGetAccount.restore();
    stubTransactions.restore();
  });

  it('should pass the action to next middleware', () => {
    middleware(store)(next)(newBlockCreated);
    expect(next).to.have.been.calledWith(newBlockCreated);
  });

  it(`should call account API methods on ${actionTypes.newBlockCreated} action when online`, () => {
    // does this matter?
    stubGetAccount.resolves({ balance: 0 });

    middleware(store)(next)(newBlockCreated);

    expect(stubGetAccount).to.have.been.calledWith();
    expect(store.dispatch).to.have.been.calledWith(activePeerUpdate({ online: true }));
  });

  it(`should call account API methods on ${actionTypes.newBlockCreated} action when offline`, () => {
    const errorCode = 'EUNAVAILABLE';
    stubGetAccount.rejects({ error: { code: errorCode } });

    middleware(store)(next)(newBlockCreated);

    expect(store.dispatch).to.have.been.calledWith(activePeerUpdate(
      { online: false, code: errorCode }));
  });

  it(`should call transactions API methods on ${actionTypes.newBlockCreated} action if account.balance changes`, () => {
    stubGetAccount.resolves({ balance: 10e8 });

    middleware(store)(next)(newBlockCreated);

    expect(stubGetAccount).to.have.been.calledWith();
    expect(stubTransactions).to.have.been.calledWith();
  });

  it(`should call transactions API methods on ${actionTypes.newBlockCreated} action if account.balance changes and the window is in blur`, () => {
    stubGetAccount.resolves({ balance: 10e8 });

    middleware(store)(next)(inactiveNewBlockCreated);

    expect(stubGetAccount).to.have.been.calledWith();
    expect(stubTransactions).to.have.been.calledWith();
  });

  it(`should call transactions API methods on ${actionTypes.newBlockCreated} action if account.balance changes the user has no transactions yet`, () => {
    stubGetAccount.resolves({ balance: 10e8 });

    state.transactions.count = 0;
    middleware(store)(next)(newBlockCreated);

    expect(stubGetAccount).to.have.been.calledWith();
    // eslint-disable-next-line no-unused-expressions
    expect(stubTransactions).to.have.been.calledOnce;
  });

  it(`should call transactions API methods on ${actionTypes.newBlockCreated} action if the window is in focus and there are recent transactions`, () => {
    stubGetAccount.resolves({ balance: 0 });

    middleware(store)(next)(newBlockCreated);

    expect(stubGetAccount).to.have.been.calledWith();
    expect(stubTransactions).to.have.been.calledWith();
  });

  it(`should fetch delegate info on ${actionTypes.newBlockCreated} action if account.balance changes and account.isDelegate`, () => {
    const delegateApiMock = stub(delegateApi, 'getDelegate').returnsPromise().resolves({ success: true, delegate: {} });
    stubGetAccount.resolves({ balance: 10e8 });
    state.account.isDelegate = true;
    store.getState = () => (state);

    middleware(store)(next)(newBlockCreated);
    expect(store.dispatch).to.have.been.calledWith();

    delegateApiMock.restore();
  });

  it(`should call fetchAndUpdateForgedBlocks(...) on ${actionTypes.newBlockCreated} action if account.balance changes and account.isDelegate`, () => {
    state.account.isDelegate = true;
    store.getState = () => (state);
    stubGetAccount.resolves({ balance: 10e8 });
    const fetchAndUpdateForgedBlocksSpy = spy(forgingActions, 'fetchAndUpdateForgedBlocks');

    middleware(store)(next)(newBlockCreated);
    expect(fetchAndUpdateForgedBlocksSpy).to.have.been.calledWith();
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

  it(`should dispatch ${actionTypes.votesFetched} action on ${actionTypes.transactionsUpdated} action if action.data.confirmed contains delegateRegistration transactions`, () => {
    const actionSpy = spy(votingActions, 'votesFetched');
    transactionsUpdatedAction.data.confirmed[0].type = transactionTypes.vote;
    middleware(store)(next)(transactionsUpdatedAction);
    expect(actionSpy).to.have.been.calledWith({
      activePeer: state.peers.data,
      address: state.account.address,
      type: 'update',
    });
  });

  it(`should dispatch accountUpdated({passphrase}) action on ${actionTypes.passphraseUsed} action if store.account.passphrase is not set`, () => {
    const action = {
      type: actionTypes.passphraseUsed,
      data: passphrase,
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(accountUpdated({ passphrase }));
  });

  it(`should not dispatch accountUpdated action on ${actionTypes.passphraseUsed} action if store.account.passphrase is already set`, () => {
    const action = {
      type: actionTypes.passphraseUsed,
      data: passphrase,
    };
    store.getState = () => ({ ...state, account: { ...state.account, passphrase } });
    middleware(store)(next)(action);
    expect(store.dispatch).to.not.have.been.calledWith();
  });
});
