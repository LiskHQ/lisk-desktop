import { expect } from 'chai';
import { spy } from 'sinon';
import io from 'socket.io-client';
import middleware from './socket';
import actionTypes from '../../constants/actions';
import { liskAPIClientUpdate } from '../../actions/peers';

describe('Socket middleware', () => {
  let store;
  let next;
  let transactions;
  let closeSpy;
  const ipcCallbacks = {};
  const socketCallbacks = {};

  beforeEach(() => {
    next = spy();
    closeSpy = spy();

    io.connect = () => ({
      on: (event, callback) => {
        socketCallbacks[event] = callback;
      },
      close: closeSpy,
    });

    window.ipc = {
      on: (type, callback) => {
        ipcCallbacks[type] = callback;
      },
    };

    store = {
      getState: () => ({
        peers: { liskAPIClient: { options: { address: 'localhost:4000' } } },
        account: { address: '1234' },
      }),
      dispatch: spy(),
    };
  });

  it(`should dispatch ${actionTypes.newBlockCreated}, on login action, unless a new block was added`, () => {
    transactions = { transactions: [{ senderId: '1234', recipientId: '5678' }] };

    expect(store.dispatch).to.not.have.been.calledWith();

    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    ipcCallbacks.focus();
    socketCallbacks['blocks/change'](transactions);

    expect(store.dispatch).to.have.been.calledWith({
      type: actionTypes.newBlockCreated,
      data: { block: transactions, windowIsFocused: true },
    });
  });


  it('should close the connection after logout', () => {
    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    expect(io.connect().close).to.not.have.been.calledWith();
    middleware(store)(next)({ type: actionTypes.accountLoggedOut });
    expect(io.connect().close).to.have.been.calledWith();
    expect(store.dispatch).to.not.have.been.calledWith(liskAPIClientUpdate({ online: false }));
  });
  // it depends on actionTypes.accountLoggedOut in test above that sets connection to null
  it('should not dispatch any action then there is no connection', () => {
    middleware(store)(next)({ type: actionTypes.accountLoggedOut });
    expect(io.connect().close).to.not.have.been.calledWith();
    expect(store.dispatch).to.not.have.been.calledWith(liskAPIClientUpdate({ online: false }));
  });

  it('should dispatch online event on reconnect', () => {
    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    socketCallbacks.reconnect();
    expect(store.dispatch).to.have.been.calledWith(liskAPIClientUpdate({ online: true }));
  });

  it(`should dispatch ${actionTypes.accountLoggedIn} with https protocol`, () => {
    store.getState = () => ({
      ...store,
      peers: { liskAPIClient: { options: { ssl: true, address: 'localhost:4000' } } },
    });
    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    expect(store.dispatch).to.not.have.been.calledWith(liskAPIClientUpdate({ online: true }));
  });

  it('should dispatch offline event on disconnect', () => {
    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    socketCallbacks.disconnect();
    expect(store.dispatch).to.have.been.calledWith(liskAPIClientUpdate({ online: false }));
  });

  it('should passes the action to next middleware', () => {
    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    expect(next).to.have.been.calledWith();
  });

  describe('window.ipc', () => {
    beforeEach(() => {
      transactions = { transactions: [{ senderId: '1234', recipientId: '5678' }] };
    });

    it('should call window.ipc.on(\'blur\') and window.ipc.on(\'focus\')', () => {
      window.ipc = {
        on: spy(),
      };

      middleware(store)(next)({ type: actionTypes.accountLoggedIn });

      expect(window.ipc.on).to.have.been.calledWith('blur');
      expect(window.ipc.on).to.have.been.calledWith('focus');
    });


    it('should loggin when windows.ipc.on is null', () => {
      window.ipc = {
        on: null,
      };

      middleware(store)(next)({ type: actionTypes.accountLoggedIn });

      expect(window.ipc.on).to.have.equal(null);
    });

    it('should register window focus changes', () => {
      middleware(store)(next)({ type: actionTypes.accountLoggedIn });
      ipcCallbacks.blur();
      socketCallbacks['blocks/change'](transactions);

      expect(store.dispatch).to.have.been.calledWith({
        type: actionTypes.newBlockCreated,
        data: { block: transactions, windowIsFocused: false },
      });
    });

    it('should register window focus changes', () => {
      middleware(store)(next)({ type: actionTypes.accountLoggedIn });
      ipcCallbacks.focus();
      socketCallbacks['blocks/change'](transactions);

      expect(store.dispatch).to.have.been.calledWith({
        type: actionTypes.newBlockCreated,
        data: { block: transactions, windowIsFocused: true },
      });
    });
  });
});

