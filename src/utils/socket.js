import io from './socketShim';
import { activePeerUpdate } from './../actions/peers';
import actionTypes from './../constants/actions';
import { SYNC_ACTIVE_INTERVAL, SYNC_INACTIVE_INTERVAL } from './../constants/api';

let connection;

export const socketSetup = (store) => {
  let interval = SYNC_ACTIVE_INTERVAL;
  const { ipc } = window;
  if (ipc) {
    ipc.on('blur', () => { interval = SYNC_INACTIVE_INTERVAL; });
    ipc.on('focus', () => { interval = SYNC_ACTIVE_INTERVAL; });
  }
  connection = io.connect(`ws://${store.getState().peers.data.options.address}`);
  connection.on('blocks/change', (block) => {
    store.dispatch({
      type: actionTypes.newBlockCreated,
      data: { block, interval },
    });
  });
  connection.on('disconnect', () => {
    store.dispatch(activePeerUpdate({ online: false }));
  });
  connection.on('reconnect', () => {
    store.dispatch(activePeerUpdate({ online: true }));
  });
};

export const closeConnection = () => {
  if (connection) {
    connection.close();
  }
};

