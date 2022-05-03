import { blockSubscribe, blockUnsubscribe } from '@block/utils';
import { tokenMap } from '@token/fungible/consts/tokens';
import {
  olderBlocksRetrieved,
  forgersRetrieved,
  networkStatusUpdated,
} from '@common/store/actions';
import networkActionTypes from '@network/store/actionTypes';
import actionTypes from './actionTypes';

const oneMinute = 1000 * 60;

const generateOnDisconnect = dispatch => () => {
  dispatch(networkStatusUpdated({ online: false }));
};

const generateOnReconnect = dispatch => () => {
  dispatch(networkStatusUpdated({ online: true }));
};

// eslint-disable-next-line no-unused-vars
const blockListener = ({ getState, dispatch }) => {
  const state = getState();
  blockUnsubscribe();

  const callback = (block) => {
    const { settings, network, blocks } = getState();
    const activeToken = settings.token && state.settings.token.active;
    const lastBtcUpdate = network.lastBtcUpdate || 0;
    const now = new Date();

    if (activeToken === tokenMap.LSK.key
      && block.data[0]?.height !== blocks.latestBlocks[0]?.height) {
      dispatch({
        type: actionTypes.newBlockCreated,
        data: {
          block: block.data.length ? block.data[0] : {},
        },
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

const blockMiddleware = store => (
  next => (action) => {
    next(action);
    switch (action.type) {
      case networkActionTypes.networkConfigSet:
        store.dispatch(olderBlocksRetrieved());
        blockListener(store);
        break;
      case actionTypes.olderBlocksRetrieved:
        store.dispatch(forgersRetrieved());
        break;

      default:
        break;
    }
  });

export default blockMiddleware;
