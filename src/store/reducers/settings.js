import actionTypes from '../../constants/actions';
import { tokenKeys } from '../../constants/tokens';


/**
 * Defines the active token. Reverts to LSK if the active token is disabled.
 *
 * @param {Object} actionToken - action.data.token value
 * @param {Object} stateToken - state.token value
 *
 * @returns {String} active token key
 */
const defineActiveToken = (actionToken, stateToken) => {
  if (!actionToken) return stateToken.active;
  if (actionToken.active && !actionToken.list) {
    return stateToken.list[actionToken.active] === true ? actionToken.active : stateToken.active;
  }

  const lastActiveToken = actionToken.active || stateToken.active;
  return actionToken.list[lastActiveToken] === false ? tokenKeys[0] : lastActiveToken;
};

export const channels = {
  academy: false,
  twitter: true,
  blog: false,
  github: false,
  reddit: false,
};

// load setting data from localStorage if it exists
const initialState = JSON.parse(localStorage.getItem('settings')) || {
  advancedMode: false,
  autoLog: true,
  showNetwork: false,
  channels,
  hardwareAccounts: {},
  isHarwareWalletConnected: false,
  isAppOpen: false,
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
      return Object.assign({}, state, action.data);
    case actionTypes.settingsReset:
      return Object.assign({}, state, {
        advancedMode: false,
        autoLog: true,
      });
    case actionTypes.switchChannel:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.data.name]: action.data.value,
        },
      };
    case actionTypes.settingsUpdateToken:
      return Object.assign({}, state, action.data, {
        token: {
          active: defineActiveToken(action.data.token, state.token),
          list: action.data.token ? action.data.token.list : state.token.list,
        },
      });
    default:
      return state;
  }
};

export default settings;
