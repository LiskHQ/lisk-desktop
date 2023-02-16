import { combineReducers } from 'redux';
import { accounts } from './acountsReducers';
import { currentDevice } from './currentDeviceReducer';
import { devices } from './devicesReducer';

export const hardwareWallet = combineReducers({
  devices,
  currentDevice,
  accounts,
});
