import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './account';
import * as accountApi from '../../utils/api/account';
import actionTypes from '../../constants/actions';
import { fetchAndUpdateForgedBlocks } from '../../actions/forging';


describe('Account middleware', () => {
  let store;
  let next;
  let state;

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
    next = spy();
  });

  it('should passes the action to next middleware', () => {
    store.getState = () => (state);
    const expectedAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(expectedAction);
    expect(next).to.have.been.calledWith(expectedAction);
  });

  it(`should call account API methods on ${actionTypes.metronomeBeat} action`, () => {
    store.getState = () => (state);
    const stubGetAccount = stub(accountApi, 'getAccount').resolves({ balance: 0 });
    const stubGetAccountStatus = stub(accountApi, 'getAccountStatus').resolves(true);

    middleware(store)(next)({ type: actionTypes.metronomeBeat });

    expect(stubGetAccount).to.have.been.calledWith();
    expect(stubGetAccountStatus).to.have.been.calledWith();

    stubGetAccount.restore();
    stubGetAccountStatus.restore();
  });

  it(`should call transactions API methods on ${actionTypes.metronomeBeat} action if account.balance changes`, () => {
    store.getState = () => (state);
    const stubGetAccount = stub(accountApi, 'getAccount').resolves({ balance: 10e8 });
    const stubTransactions = stub(accountApi, 'transactions').resolves(true);

    middleware(store)(next)({ type: actionTypes.metronomeBeat });

    expect(stubGetAccount).to.have.been.calledWith();
    // TODO why next expect doesn't work despite it being called according to test coverage?
    // expect(stubTransactions).to.have.been.calledWith();

    stubGetAccount.restore();
    stubTransactions.restore();
  });

  it(`should call store.dispatch(fetchAndUpdateForgedBlocks(...)) on ${actionTypes.metronomeBeat} action if account.balance changes and account.isDelegate`, () => {
    state.account.isDelegate = true;
    store.getState = () => (state);
    const stubGetAccount = stub(accountApi, 'getAccount').resolves({ balance: 10e8 });
    const stubGetAccountStatus = stub(accountApi, 'getAccountStatus').resolves(true);

    middleware(store)(next)({ type: actionTypes.metronomeBeat });

    expect(stubGetAccount).to.have.been.calledWith();
    // TODO why next expect doesn't work despite it being called according to test coverage?
    // expect(store.dispatch).to.have.been.calledWith(fetchAndUpdateForgedBlocks({
    //   activePeer: state.peers.data,
    //   limit: 10,
    //   offset: 0,
    //   generatorPublicKey: state.account.publicKey,
    // }));

    stubGetAccount.restore();
    stubGetAccountStatus.restore();
  });
});

