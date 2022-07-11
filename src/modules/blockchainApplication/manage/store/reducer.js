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
  applications: {},
  current: null,
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

/**
 *
 * @param {Object} state
 * @param {type: String, data: Object} action
 */
export const applications = (state = initialState.applications, { type, application, chainId }) => {
  switch (type) {
    case actionTypes.addApplicationByChainId:
      // In cases where a new node for an existing application is being added,
      // the new service url should be appended to the serviceURLs array of the application
      if (application.chainID in state) {
        state[application.chainID].serviceURLs.push(application.serviceURLs);
      } else {
        state[application.chainID] = application;
      }
      return state;

    case actionTypes.deleteApplicationByChainId: {
      delete state[chainId];
      return { ...state };
    }

    default:
      return state;
  }
};

/**
 *
 * @param {Object} state
 * @param {type: String, application: Object} action
 */
export const current = (state = null, { type, application }) => {
  switch (type) {
    case actionTypes.setCurrentApplication:
      return application;
    default:
      return state;
  }
};

const persistConfig = {
  storage,
  key: 'blockChainApplications',
  whitelist: ['pins', 'applications'],
  blacklist: ['current'],
};

const blockChainApplicationsReducer = combineReducers({ pins, applications, current });

// eslint-disable-next-line import/prefer-default-export
export const blockChainApplications = persistReducer(persistConfig, blockChainApplicationsReducer);
