import actionTypes from '../../constants/actions';

/**
 * The reducer for maintaining active peer
 *
 * @param {Array} state - the current state object
 * @param {Object} action - The action containing type and data
 *
 * @returns {Object} - Next state object
 */
const peers = (state = { status: {}, options: {} }, action) => {
  switch (action.type) {
    case actionTypes.liskAPIClientSet:
      return Object.assign({}, state, {
        liskAPIClient: action.data.liskAPIClient ? action.data.liskAPIClient : action.data,
        // options are duplicated here because lisk-js later on removes it from the 'data' object
        options: action.data.options,
      });
    case actionTypes.activePeerUpdate:
      return Object.assign({}, state, { status: action.data });
    default:
      return state;
  }
};

export default peers;
