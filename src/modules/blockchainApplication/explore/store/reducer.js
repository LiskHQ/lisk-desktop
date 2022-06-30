import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { storage } from '../../../../../packages/common/store';
import actionTypes from './actionTypes';

/**
 *
 * @param {Object} state
 * @param {type: String, chainId: string} action
 */
export const pins = (state = [], { type, chainId }) => {
  switch (type) {
    case actionTypes.setApplicationPin:
      return chainId ? [...state, chainId] : [...state];
    case actionTypes.removeApplicationPin:
      return state.filter((pinnedChainId) => pinnedChainId !== chainId);
    default:
      return state;
  }
};

const persistConfig = {
  storage,
  key: 'blockChainApplications',
  whitelist: ['pinnedList'],
  blacklist: [],
};

const blockChainApplicationsReducer = combineReducers({ pins });

// eslint-disable-next-line import/prefer-default-export
export const blockChainApplications = persistReducer(persistConfig, blockChainApplicationsReducer);
