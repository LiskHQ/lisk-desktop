import { IPC_MESSAGES } from '@libs/hwServer/constants';
import { devices, initialState } from './devicesReducer';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

describe('HardwareWallet reducer', () => {
  it('Should update hardwareDevices when dispatching DEVICE_LIST_CHANGED', async () => {
    const updatedDevices = [
      {
        deviceId: '3',
      }
    ];
    const actionData = {
      type: DEVICE_LIST_CHANGED,
      payload: updatedDevices,
    };
    const expectedState = {
      hardwareDevices: updatedDevices,
      activeHardwareDeviceId: initialState.activeHardwareDeviceId,
    };
    expect(devices(initialState, actionData)).toEqual(expectedState);
  });

  it('Should update activeHardwareDeviceId when dispatching DEVICE_UPDATE', async () => {
    const selectedDeviceId = '1';
    const actionData = {
      type: DEVICE_UPDATE,
      payload: selectedDeviceId,
    };
    const expectedState = {
      hardwareDevices: initialState.hardwareDevices,
      activeHardwareDeviceId: selectedDeviceId,
    };
    expect(devices(initialState, actionData)).toEqual(expectedState);
  });

  it('Should update activeHardwareDeviceId when dispatching DEVICE_UPDATE', async () => {
    const selectedDeviceId = '1';
    const actionData = {
      type: DEVICE_UPDATE,
      payload: selectedDeviceId,
    };
    const expectedState = {
      hardwareDevices: initialState.hardwareDevices,
      activeHardwareDeviceId: selectedDeviceId,
    };
    expect(devices(initialState, actionData)).toEqual(expectedState);
  });

  it('Should return default state', async () => {
    expect(devices(initialState, {})).toEqual(initialState);
  });
});
