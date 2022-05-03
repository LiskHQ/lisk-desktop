import actionTypes from './actionTypes';

const initialState = {
  status: {},
  networks: {},
  storedCustomNetwork: '',
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
    case actionTypes.lastBtcUpdateSet:
      return {
        ...state,
        lastBtcUpdate: action.data,
      };
    case actionTypes.customNetworkStored:
      return {
        ...state,
        storedCustomNetwork: action.data,
      };
    case actionTypes.customNetworkRemoved:
      return {
        ...state,
        storedCustomNetwork: '',
      };
    default:
      return state;
  }
};

export default network;
