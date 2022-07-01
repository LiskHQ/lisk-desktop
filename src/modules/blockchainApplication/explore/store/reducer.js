import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { storage } from '../../../../../packages/common/store';
import actionTypes from './actionTypes';

/**
 *
 * @param {Object} state
 * @param {type: String, chainId: string} action
 */
export const pins = (state = [], { type, data }) => {
  switch (type) {
    case actionTypes.setApplicationPin:
      return data ? [...state, data] : [...state];
    case actionTypes.removeApplicationPin:
      return state.filter((pinnedChainId) => pinnedChainId !== data);
    default:
      return state;
  }
};

const persistConfig = {
  storage,
  key: 'blockChainApplications',
  whitelist: ['pins'],
  blacklist: [],
};

const blockChainApplicationsReducer = combineReducers({ pins });

// eslint-disable-next-line import/prefer-default-export
export const blockChainApplications = persistReducer(persistConfig, blockChainApplicationsReducer);
