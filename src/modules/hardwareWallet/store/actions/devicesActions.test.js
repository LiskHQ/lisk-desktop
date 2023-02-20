import actionTypes from './actionTypes';
import { setHardwareWalletDevices, setCurrentDevice } from './devicesActions';

describe('hardwareWalletActions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create an action to update devices', () => {
    const devices = [{ deviceId: '1' }];
    const expectedAction = {
      type: actionTypes.setDevices,
      devices,
    };

    expect(setHardwareWalletDevices(devices)).toEqual(expectedAction);
  });

  it('should create an action to update device', () => {
    const device = { deviceId: '1' };
    const expectedAction = {
      type: actionTypes.setCurrentDevice,
      device,
    };

    expect(setCurrentDevice(device)).toEqual(expectedAction);
  });
});
