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
 * @param {type: String, app: Object, apps: Object, chainId: String} action
 */
export const applications = (
  state = initialState.applications,
  { type, app, apps, chainId, network }
) => {
  switch (type) {
    case actionTypes.addApplicationByChainId:
      return { ...state, [network]: { ...state[network], [app.chainID]: app } };

    case actionTypes.setApplications: {
      return apps.reduce(
        (result, application) => ({
          ...result,
          [network]: { ...result[network], [application.chainID]: application },
        }),
        { ...state }
      );
    }

    case actionTypes.deleteApplicationByChainId: {
      delete state[network][chainId];
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

const persistConfig = {
  storage,
  key: 'blockChainApplications',
  whitelist: ['pins', 'applications'],
  blacklist: ['current'],
};

const blockChainApplicationsReducer = combineReducers({
  pins,
  applications,
  current,
});

export const blockChainApplications = persistReducer(persistConfig, blockChainApplicationsReducer);
