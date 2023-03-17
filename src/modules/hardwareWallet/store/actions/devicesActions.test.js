import actionTypes from './actionTypes';
import { setHWDevices, setCurrentHWDevice } from './devicesActions';

describe('hardwareWalletActions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create an action to update devices', () => {
    const devices = [{ deviceId: '1' }];
    const expectedAction = {
      type: actionTypes.setHWDevices,
      devices,
    };

    expect(setHWDevices(devices)).toEqual(expectedAction);
  });

  it('should create an action to update device', () => {
    const device = { deviceId: '1' };
    const expectedAction = {
      type: actionTypes.setCurrentHWDevice,
      device,
    };

    expect(setCurrentHWDevice(device)).toEqual(expectedAction);
  });
});
