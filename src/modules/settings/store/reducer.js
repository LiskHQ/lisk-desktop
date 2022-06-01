import { deepMergeObj } from 'src/utils/helpers';
import actionTypes from './actionTypes';

export const channels = {
  academy: false,
  twitter: true,
  blog: false,
  github: false,
  reddit: false,
};

// load setting data from localStorage if it exists and merge with initial state
export const initialState = {
  showNetwork: false,
  channels,
  hardwareAccounts: {},
  isRequestHowItWorksDisable: false,
  statistics: false,
  areTermsOfUseAccepted: false,
  discreetMode: false,
  sideBarExpanded: true,
  enableCustomDerivationPath: false,
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
      return action.data;
    }
    case actionTypes.settingsUpdated:
      return deepMergeObj(state, action.data);
    case actionTypes.settingsReset:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default settings;
