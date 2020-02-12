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
        name: action.data.name,
        networks: {
          ...state.networks,
          [action.data.token]: action.data.network || {},
        },
      };
    case actionTypes.networkStatusUpdated:
      return {
        ...state,
        status: action.data,
      };
    default:
      return state;
  }
};

export default network;
