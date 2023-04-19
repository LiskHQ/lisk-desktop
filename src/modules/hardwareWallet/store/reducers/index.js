import { combineReducers } from 'redux';
import { storage } from 'src/redux/store';
import { persistReducer } from 'redux-persist';
import { accounts } from './accountsReducers';
import { currentDevice } from './currentDeviceReducer';
import { devices } from './devicesReducer';

const persistConfig = {
  key: 'hwAccount',
  storage,
  whitelist: ['accounts'],
};

export const combinedHardwareWallet = combineReducers({
  devices,
  currentDevice,
  accounts,
});

export const hardwareWallet = persistReducer(persistConfig, combinedHardwareWallet);
