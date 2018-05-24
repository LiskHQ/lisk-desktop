import actionTypes from '../../constants/actions';

// load setting data from localStorage if it exists
const initialState = JSON.parse(localStorage.getItem('settings')) || {
  advancedMode: false,
  autoLog: true,
  onBoarding: localStorage.getItem('onboarding') !== 'false',
};

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const settings = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.settingsUpdated:
      return Object.assign({}, state, action.data);
    case actionTypes.settingsReset:
      return Object.assign({}, state, {
        advancedMode: false,
        autoLog: true,
      });
    default:
      return state;
  }
};

export default settings;
