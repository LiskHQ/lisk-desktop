import actionTypes from '../../constants/actions';

const initialState = {
  status: {},
  networks: {},
};

/**
 * The reducer for maintaining connected networks
 *
 * @param {Array} state - the current state object
 * @param {Object} action - The action containing type and data
 *
 * @returns {Object} - Next state object
 */
const network = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.networkSet:
      return {
        ...state,
        name: action.data.config.name,
        serviceUrl: action.data.serviceUrl, // TODO
        networks: {
          ...state.networks,
          [action.data.token]: action.data.config || {},
        },
      };
    case actionTypes.networkStatusUpdated:
      return {
        ...state,
        status: action.data,
      };
    case actionTypes.serviceUrlSet:
      return {
        ...state,
        serviceUrl: action.data,
      };
    case actionTypes.socketConnectionsUpdated:
      return {
        ...state,
        socketConnections: action.data,
      };
    case actionTypes.lastBtcUpdateSet:
      return {
        ...state,
        lastBtcUpdate: action.data,
      };
    default:
      return state;
  }
};

export default network;
