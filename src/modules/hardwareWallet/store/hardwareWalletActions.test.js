import { IPC_MESSAGES } from '@libs/hwServer/constants';
import {
  setDeviceListChanged,
  setDeviceUpdated,
} from './hardwareWalletActions';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;


describe('hardwareWalletActions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create an action to update activeHardwareDeviceId', () => {
    const devices = [{deviceId: '1'}];
    const expectedAction = {
      type: DEVICE_LIST_CHANGED,
      payload: devices,
    };

    expect(setDeviceListChanged(devices)).toEqual(expectedAction);
  });

  it('should create an action to update activeHardwareDeviceId', () => {
    const expectedAction = {
      type: DEVICE_UPDATE,
      payload: '1',
    };

    expect(setDeviceUpdated('1')).toEqual(expectedAction);
  });
});
