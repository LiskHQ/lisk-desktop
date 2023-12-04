import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { storage } from 'src/redux/store';
import actionTypes from './actionTypes';

/**
 * Initial State
 */
const initialState = {
  pins: [],
  applications: {},
  current: null,
};

export const pins = (state = initialState.pins, { type, chainId }) => {
  switch (type) {
    case actionTypes.toggleApplicationPin:
      if (state.includes(chainId) && chainId) {
        return state.filter((pinnedChainId) => pinnedChainId !== chainId);
      }
      return chainId ? [...state, chainId] : [...state];

    case actionTypes.deleteApplicationByChainId:
      if (state.includes(chainId)) {
        return state.filter((pinnedChainId) => pinnedChainId !== chainId);
      }
      return state;

    default:
      return state;
  }
};

// eslint-disable-next-line max-statements
export const applications = (
  state = initialState.applications,
  { type, app, apps, chainId, network, currentName, newName, networks }
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

    case actionTypes.cleanupApplications: {
      const applicationsByNetwork = Object.keys(state).reduce((accumulator, networkName) => {
        const networkSideChains = {
          [networkName]: Object.values(state[networkName]).filter(
            (application) => application?.status
          ),
        };
        return { ...accumulator, ...networkSideChains };
      }, {});

      return applicationsByNetwork;
    }

    case actionTypes.deleteNetworksInApplications: {
      networks.forEach((networkToDelete) => {
        delete state[networkToDelete];
      });
      return { ...state };
    }

    case actionTypes.updateNetworkNameInApplications: {
      const { [currentName]: oldName, ...rest } = state;
      return { ...rest, [newName]: { ...oldName } };
    }

    case actionTypes.deleteApplicationByChainId: {
      delete state[network][chainId];
      const { [chainId]: chainToRemove, ...restApplications } = state[network];
      return { ...state, [network]: { ...restApplications } };
    }

    default:
      return state;
  }
};

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
  whitelist: ['pins', 'applications', 'current'],
};

const blockChainApplicationsReducer = combineReducers({
  pins,
  applications,
  current,
});

export const blockChainApplications = persistReducer(persistConfig, blockChainApplicationsReducer);
