import { actionTypes, tokenMap } from '@common/configuration';
import { deepMergeObj } from '@common/utilities/helpers';

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
    ? { ...state, token: { active: tokenMap.LSK.key, list: state.token.list } }
    : state
);

// load setting data from localStorage if it exists and merge with initial state
export const initialState = {
  autoLog: true,
  showNetwork: false,
  channels,
  hardwareAccounts: {},
  isRequestHowItWorksDisable: false,
  statistics: false,
  areTermsOfUseAccepted: false,
  discreetMode: false,
  token: {
    active: tokenMap.LSK.key,
    list: {
      [tokenMap.LSK.key]: true,
      [tokenMap.BTC.key]: false,
    },
  },
  sideBarExpanded: true,
  currency: 'USD',
};

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const settings = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.settingsRetrieved: {
      return validateToken(action.data);
    }
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
