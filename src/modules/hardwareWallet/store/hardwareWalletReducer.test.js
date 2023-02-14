import { IPC_MESSAGES } from '@libs/hwServer/constants';
import { hardwareWallet, initialState } from './hardwareWalletReducer';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

describe('Auth reducer', () => {
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
    expect(hardwareWallet(initialState, actionData)).toEqual(expectedState);
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
    expect(hardwareWallet(initialState, actionData)).toEqual(expectedState);
  });
});
