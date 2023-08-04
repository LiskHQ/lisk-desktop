import { persistReducer } from 'redux-persist';
import { deepMergeObj } from 'src/utils/helpers';
import { storage } from 'src/redux/store';
import networks from '@network/configuration/networks';
import { DEFAULT_NETWORK } from 'src/const/config';
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
  darkMode: false,
  discreetMode: false,
  sideBarExpanded: true,
  enableAccessToLegacyAccounts: false,
  currency: 'USD',
  customNetworks: [],
  mainChainNetwork: networks[DEFAULT_NETWORK],
};

const settings = (state = initialState, action) => {
  switch (action.type) {
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

const persistConfig = {
  key: 'settings',
  storage,
};

export default persistReducer(persistConfig, settings);
