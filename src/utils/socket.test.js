import { expect } from 'chai';
import { spy } from 'sinon';
import io from './socketShim';
import actionTypes from './../constants/actions';
import { SYNC_ACTIVE_INTERVAL, SYNC_INACTIVE_INTERVAL } from './../constants/api';
import { socketSetup } from './socket';

describe('Socket', () => {
  let store;
  let transactions;
  const ipcCallbacks = {};
  const socketCallbacks = {};

  beforeEach(() => {
    io.connect = () => ({
      on: (event, callback) => {
        socketCallbacks[event] = callback;
      },
    });

    window.ipc = {
      on: (type, callback) => {
        ipcCallbacks[type] = callback;
      },
    };
  });

  it(`should dispatch ${actionTypes.newBlockCreated} unless a new block was added`, () => {
    transactions = { transactions: [{ senderId: '1234', recipientId: '5678' }] };
    store = {
      getState: () => ({
        peers: { data: { options: { address: 'localhost:4000' } } },
        account: { address: '1234' },
      }),
      dispatch: spy(),
    };

    socketSetup(store);

    expect(store.dispatch).to.not.have.been.calledWith();

    ipcCallbacks.focus();
    socketCallbacks['blocks/change'](transactions);

    expect(store.dispatch).to.have.been.calledWith({
      type: actionTypes.newBlockCreated,
      data: { block: transactions, interval: SYNC_ACTIVE_INTERVAL },
    });
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
      socketSetup(store);

      expect(window.ipc.on).to.have.been.calledWith('blur');
      expect(window.ipc.on).to.have.been.calledWith('focus');
    });

    it('should set window.ipc to set the interval to SYNC_INACTIVE_INTERVAL on blur', () => {
      socketSetup(store);
      ipcCallbacks.blur();
      socketCallbacks['blocks/change'](transactions);

      expect(store.dispatch).to.have.been.calledWith({
        type: actionTypes.newBlockCreated,
        data: { block: transactions, interval: SYNC_INACTIVE_INTERVAL },
      });
    });

    it('should set window.ipc to set the interval to SYNC_ACTIVE_INTERVAL on focus', () => {
      socketSetup(store);
      ipcCallbacks.focus();
      socketCallbacks['blocks/change'](transactions);

      expect(store.dispatch).to.have.been.calledWith({
        type: actionTypes.newBlockCreated,
        data: { block: transactions, interval: SYNC_ACTIVE_INTERVAL },
      });
    });
  });
});

