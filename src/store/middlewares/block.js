import { blockSubscribe, blockUnsubscribe } from '@api/block';
import { forgersSubscribe, forgersUnsubscribe } from '@api/delegate';
import { tokenMap, actionTypes } from '@constants';
import {
  olderBlocksRetrieved,
  forgersRetrieved,
  networkStatusUpdated,
} from '@actions';

const oneMinute = 1000 * 60;

const generateOnDisconnect = dispatch => () => {
  dispatch(networkStatusUpdated({ online: false }));
};

const generateOnReconnect = dispatch => () => {
  dispatch(networkStatusUpdated({ online: true }));
};

const blockListener = ({ getState, dispatch }) => {
  const state = getState();
  blockUnsubscribe();

  const callback = (block) => {
    const { settings, network } = getState();
    const activeToken = settings.token && state.settings.token.active;
    const lastBtcUpdate = network.lastBtcUpdate || 0;
    const now = new Date();

    if (activeToken === tokenMap.LSK.key) {
      dispatch({
        type: actionTypes.newBlockCreated,
        data: { block },
      });
      dispatch(forgersRetrieved());
    }
    if (activeToken === tokenMap.BTC.key && (now - lastBtcUpdate > oneMinute)) {
      dispatch({
        type: actionTypes.lastBtcUpdateSet,
        data: now,
      });
    }
  };

  blockSubscribe(
    state.network,
    callback,
    generateOnDisconnect(dispatch),
    generateOnReconnect(dispatch),
  );
};

const forgingListener = ({ getState, dispatch }) => {
  const state = getState();
  forgersUnsubscribe();

  const callback = () => dispatch(forgersRetrieved());

  forgersSubscribe(
    state.network,
    callback,
    generateOnDisconnect(dispatch),
    generateOnReconnect(dispatch),
  );
};

const blockMiddleware = store => (
  next => (action) => {
    next(action);
    switch (action.type) {
      case actionTypes.networkConfigSet:
        store.dispatch(olderBlocksRetrieved());
        blockListener(store);
        forgingListener(store);
        break;
      case actionTypes.olderBlocksRetrieved:
        store.dispatch(forgersRetrieved());
        break;

      default:
        break;
    }
  });

export default blockMiddleware;
