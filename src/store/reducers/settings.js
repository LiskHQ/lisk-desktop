import actionTypes from '../../constants/actions';
import { tokenKeys } from '../../constants/tokens';
import { deepMergeObj } from '../../utils/helpers';

export const channels = {
  academy: false,
  twitter: true,
  blog: false,
  github: false,
  reddit: false,
};

/**
 * Function to validate that the active token is enabled on the settings, otherwise
 * sets the default token to LSK.
 * @param {Object} state
 * @returns {Object} -> state with correct active token.
 */
const validateToken = state => (
  state.token && !state.token.list[state.token.active]
    ? { ...state, token: { active: tokenKeys[0], list: state.token.list } }
    : state
);

// load setting data from localStorage if it exists
export const initialState = JSON.parse(localStorage.getItem('settings')) || {
  autoLog: true,
  showNetwork: false,
  channels,
  hardwareAccounts: {},
  isHarwareWalletConnected: false,
  isRequestHowItWorksDisable: false,
  statistics: false,
  areTermsOfUseAccepted: false,
  token: {
    active: tokenKeys[0],
    list: tokenKeys.reduce((acc, key) => { acc[key] = true; return acc; }, {}),
  },
};

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const settings = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.settingsUpdated:
      return validateToken(deepMergeObj(state, action.data));
    case actionTypes.settingsReset:
      return {
        ...state,
        autoLog: true,
      };
    default:
      return state;
  }
};

export default settings;
