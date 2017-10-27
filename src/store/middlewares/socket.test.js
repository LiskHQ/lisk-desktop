import { expect } from 'chai';
import { spy, stub } from 'sinon';
import io from './../../utils/socketShim';
import middleware from './socket';
import actionTypes from '../../constants/actions';
import { SYNC_ACTIVE_INTERVAL, SYNC_INACTIVE_INTERVAL } from '../../constants/api';


describe('Socket middleware', () => {
  let store;
  let next;
  let transactions;
  const ipcCallbacks = {};
  const socketCallbacks = {};

  beforeEach(() => {
    next = spy();
    store = stub();

    io.connect = () => ({
      on: (event, callback) => {
        socketCallbacks[event] = callback;
      },
      close: spy(),
    });

    window.ipc = {
      on: (type, callback) => {
        ipcCallbacks[type] = callback;
      },
    };
  });

  it(`should dispatch ${actionTypes.newBlockCreated}, on login action, unless a new block was added`, () => {
    transactions = { transactions: [{ senderId: '1234', recipientId: '5678' }] };
    store = {
      getState: () => ({
        peers: { data: { options: { address: 'localhost:4000' } } },
        account: { address: '1234' },
      }),
      dispatch: stub(),
    };

    expect(store.dispatch).to.not.have.been.calledWith();

    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    ipcCallbacks.focus();
    socketCallbacks['blocks/change'](transactions);

    expect(store.dispatch).to.have.been.calledWith({
      type: actionTypes.newBlockCreated,
      data: { block: transactions, interval: SYNC_ACTIVE_INTERVAL },
    });
  });


  it('should close the connection after logout', () => {
    store = {
      getState: () => ({
        peers: { data: { options: { address: 'localhost:4000' } } },
        account: { address: '1234' },
      }),
      dispatch: spy(),
    };

    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    expect(io.connect().close).to.not.have.been.calledWith();
    middleware(store)(next)({ type: actionTypes.accountLoggedOut });
    // TODO: figure out why spy wasn't called
    // expect(io.connect().close).to.have.been.calledWith();
  });


  it('should passes the action to next middleware', () => {
    store = {
      getState: () => ({
        peers: { data: { options: { address: 'localhost:4000' } } },
        account: { address: '1234' },
      }),
      dispatch: spy(),
    };

    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    expect(next).to.have.been.calledWith();
  });

  describe('window.ipc', () => {
    beforeEach(() => {
      transactions = { transactions: [{ senderId: '1234', recipientId: '5678' }] };
      store = {
        getState: () => ({
          peers: { data: { options: { address: 'localhost:4000' } } },
          account: { address: '1234' },
        }),
        dispatch: spy(),
      };
    });

    it('should call window.ipc.on(\'blur\') and window.ipc.on(\'focus\')', () => {
      window.ipc = {
        on: spy(),
      };

      middleware(store)(next)({ type: actionTypes.accountLoggedIn });

      expect(window.ipc.on).to.have.been.calledWith('blur');
      expect(window.ipc.on).to.have.been.calledWith('focus');
    });

    it('should set window.ipc to set the interval to SYNC_INACTIVE_INTERVAL on blur', () => {
      middleware(store)(next)({ type: actionTypes.accountLoggedIn });
      ipcCallbacks.blur();
      socketCallbacks['blocks/change'](transactions);

      expect(store.dispatch).to.have.been.calledWith({
        type: actionTypes.newBlockCreated,
        data: { block: transactions, interval: SYNC_INACTIVE_INTERVAL },
      });
    });

    it('should set window.ipc to set the interval to SYNC_ACTIVE_INTERVAL on focus', () => {
      middleware(store)(next)({ type: actionTypes.accountLoggedIn });
      ipcCallbacks.focus();
      socketCallbacks['blocks/change'](transactions);

      expect(store.dispatch).to.have.been.calledWith({
        type: actionTypes.newBlockCreated,
        data: { block: transactions, interval: SYNC_ACTIVE_INTERVAL },
      });
    });
  });
});

