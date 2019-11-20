import { expect } from 'chai';
import { spy } from 'sinon';
import io from 'socket.io-client';
import middleware from './socket';
import actionTypes from '../../constants/actions';
import { networkStatusUpdated } from '../../actions/network';

describe('Socket middleware', () => {
  let store;
  let state;
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
      account: { address: '1234' },
      settings: {
        token: {
          active: 'LSK',
        },
      },
    };
    store = {
      getState: () => state,
      dispatch: spy(),
    };
  });

  it(`should dispatch ${actionTypes.newBlockCreated}, on login action, unless a new block was added`, () => {
    transactions = { transactions: [{ senderId: '1234', recipientId: '5678' }] };

    expect(store.dispatch).to.not.have.been.calledWith();

    middleware(store)(next)({ type: actionTypes.networkSet });
    ipcCallbacks.focus();
    socketCallbacks['blocks/change'](transactions);

    expect(store.dispatch).to.have.been.calledWith({
      type: actionTypes.newBlockCreated,
      data: { block: transactions, windowIsFocused: true },
    });
  });

  it('should dispatch online event on reconnect', () => {
    middleware(store)(next)({ type: actionTypes.networkSet });
    socketCallbacks.reconnect();
    expect(store.dispatch).to.have.been.calledWith(networkStatusUpdated({ online: true }));
  });

  it(`should dispatch ${actionTypes.networkSet} with https protocol`, () => {
    state = {
      ...state,
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
    };
    middleware(store)(next)({ type: actionTypes.networkSet });
    expect(store.dispatch).to.not.have.been.calledWith(networkStatusUpdated({ online: true }));
  });

  it('should dispatch offline event on disconnect', () => {
    middleware(store)(next)({ type: actionTypes.networkSet });
    socketCallbacks.disconnect();
    expect(store.dispatch).to.have.been.calledWith(networkStatusUpdated({ online: false }));
  });

  it('should passes the action to next middleware', () => {
    middleware(store)(next)({ type: actionTypes.networkSet });
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

      middleware(store)(next)({ type: actionTypes.networkSet });

      expect(window.ipc.on).to.have.been.calledWith('blur');
      expect(window.ipc.on).to.have.been.calledWith('focus');
    });


    it('should loggin when windows.ipc.on is null', () => {
      window.ipc = {
        on: null,
      };

      middleware(store)(next)({ type: actionTypes.networkSet });

      expect(window.ipc.on).to.have.equal(null);
    });

    it('should register window focus changes', () => {
      middleware(store)(next)({ type: actionTypes.networkSet });
      ipcCallbacks.blur();
      socketCallbacks['blocks/change'](transactions);

      expect(store.dispatch).to.have.been.calledWith({
        type: actionTypes.newBlockCreated,
        data: { block: transactions, windowIsFocused: false },
      });
    });

    it('should register window focus changes', () => {
      middleware(store)(next)({ type: actionTypes.networkSet });
      ipcCallbacks.focus();
      socketCallbacks['blocks/change'](transactions);

      expect(store.dispatch).to.have.been.calledWith({
        type: actionTypes.newBlockCreated,
        data: { block: transactions, windowIsFocused: true },
      });
    });
  });
});
