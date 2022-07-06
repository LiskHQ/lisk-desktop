import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { storage } from 'src/redux/store';
import actionTypes from './actionTypes';

/**
 * Initial State
 * @param {Array} state
 * @param {Object} action
 */
const initialState = {
  pins: [],
  applications: [],
};

/**
 *
 * @param {Object} state
 * @param {type: String, chainId: string} action
 */
export const pins = (state = initialState.pins, { type, chainId }) => {
  switch (type) {
    case actionTypes.toggleApplicationPin:
      if (state.includes(chainId) && chainId) {
        return state.filter((pinnedChainId) => pinnedChainId !== chainId);
      }
      return chainId ? [...state, chainId] : [...state];

    default:
      return state;
  }
};

export const applications = (state = initialState.applications, { type, data: chainId }) => {
  switch (type) {
    case actionTypes.filterApplicationsByChainId:
      return state.filter((application) => application.chainId === chainId);

    default:
      return state;
  }
};

const persistConfig = {
  storage,
  key: 'blockChainApplications',
  whitelist: ['pins', 'applications'],
  blacklist: [],
};

const blockChainApplicationsReducer = combineReducers({ pins, applications });

// eslint-disable-next-line import/prefer-default-export
export const blockChainApplications = persistReducer(persistConfig, blockChainApplicationsReducer);
