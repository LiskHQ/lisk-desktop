import actionTypes from '../../constants/actions';

// load setting data from localStrage if it exists
const initialState = JSON.parse(localStorage.getItem('settings')) || {
  advancedMode: false,
  autoLog: true,
};

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const settings = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.advancedModeChanged:
      return Object.assign({}, state, { advancedMode: action.data });
    case actionTypes.autoLogChanged:
      return Object.assign({}, state, { autoLog: action.data });
    default:
      return state;
  }
};

export default settings;
