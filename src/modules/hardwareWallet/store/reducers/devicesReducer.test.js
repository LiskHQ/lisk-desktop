import actionTypes from '@hardwareWallet/store/actions/actionTypes';
import { devices, initialState } from './devicesReducer';

describe('HardwareWallet reducer devices', () => {
  it('Should update hardwareDevices when dispatching actionTypes.setDevices', async () => {
    const updatedDevices = [
      {
        path: '3',
      },
    ];
    const actionData = {
      type: actionTypes.setDevices,
      devices: updatedDevices,
    };
    expect(devices(initialState, actionData)).toEqual(updatedDevices);
  });

  it('Should return default state', async () => {
    expect(devices(initialState, {})).toEqual(initialState);
  });
});
