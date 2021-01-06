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
    case actionTypes.networkConfigSet:
      return {
        ...state,
        name: action.data.name,
        networks: {
          ...state.networks,
          ...action.data.networks,
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
