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
  node: {},
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
 * @param {type: String, app: Object, apps: Object, chainId: String} action
 */
export const applications = (state = initialState.applications, { type, app, apps, chainId }) => {
  switch (type) {
    case actionTypes.addApplicationByChainId:
      // In cases where a new node for an existing application is being added,
      // the new node url should be appended to the apis array of the application
      if (app.chainID in state) {
        return {
          ...state,
          [app.chainID]: {
            serviceURLs: app.serviceURLs,
          },
        };
      }

      return { ...state, [app.chainID]: app };

    case actionTypes.setApplications: {
      return apps.reduce(
        (result, application) => {
          if (application.chainID in result) {
            return {
              ...result,
              [application.chainID]: {
                ...result[application.chainID],
                serviceURLs: application.serviceURLs,
              },
            };
          }

          return { ...result, [application.chainID]: application };
        },
        { ...state }
      );
    }

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
export const current = (state = initialState.current, { type, app }) => {
  switch (type) {
    case actionTypes.setCurrentApplication:
      return app;
    default:
      return state;
  }
};

/**
 *
 * @param {Object} state
 * @param {type: String, nodeInfo: Object} action
 */
export const node = (state = initialState.node, { type, nodeInfo }) => {
  switch (type) {
    case actionTypes.setApplicationNode:
      return nodeInfo;
    default:
      return state;
  }
};

const persistConfig = {
  storage,
  key: 'blockChainApplications',
  whitelist: ['pins', 'applications'],
  blacklist: ['current', 'node'],
};

const blockChainApplicationsReducer = combineReducers({
  pins,
  applications,
  current,
  node,
});

export const blockChainApplications = persistReducer(persistConfig, blockChainApplicationsReducer);
