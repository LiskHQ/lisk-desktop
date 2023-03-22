import actionTypes from '../actions/actionTypes';
import { currentDevice, initialState } from './currentDeviceReducer';

describe('HardwareWallet current device reducer', () => {

  it('updates current device', () => {
    const action = {
      type: actionTypes.setCurrentHWDevice,
      payload: {
        path: '20231',
        model: 'Nano S',
        brand: 'Ledger',
      }
    };
    const updatedState = currentDevice(initialState, action);
    expect(updatedState).toEqual(action.payload);
  });

  it('returns default state', () => {
    const action = {
      type: 'OTHER_ACTION_TYPE',
    };
    const updatedState = currentDevice(initialState, action);
    expect(updatedState).toEqual(initialState);
  });
});
