import { blockSubscribe, blockUnsubscribe } from '@block/utils';
import { olderBlocksRetrieved, forgersRetrieved, networkStatusUpdated } from 'src/redux/actions';
import networkActionTypes from '@network/store/actionTypes';
import actionTypes from './actionTypes';

const generateOnDisconnect = (dispatch) => () => {
  dispatch(networkStatusUpdated({ online: false }));
};

const generateOnReconnect = (dispatch) => () => {
  dispatch(networkStatusUpdated({ online: true }));
};

// eslint-disable-next-line no-unused-vars
const blockListener = ({ getState, dispatch }) => {
  const state = getState();
  blockUnsubscribe();

  const callback = (block) => {
    const { blocks } = getState();

    if (block.data[0]?.height !== blocks.latestBlocks[0]?.height) {
      dispatch({
        type: actionTypes.newBlockCreated,
        data: {
          block: block.data.length ? block.data[0] : {},
        },
      });
      dispatch(forgersRetrieved());
    }
  };

  blockSubscribe(
    state.network,
    callback,
    generateOnDisconnect(dispatch),
    generateOnReconnect(dispatch)
  );
};

const blockMiddleware = (store) => (next) => (action) => {
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
};

export default blockMiddleware;
