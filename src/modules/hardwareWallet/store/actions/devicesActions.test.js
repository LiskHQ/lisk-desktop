import actionTypes from './actionTypes';
import { setHWDevices, setCurrentHWDevice } from './devicesActions';

describe('hardwareWalletActions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create an action to update devices', () => {
    const devices = [{ path: '1' }];
    const expectedAction = {
      type: actionTypes.setHWDevices,
      payload: devices,
    };

    expect(setHWDevices(devices)).toEqual(expectedAction);
  });

  it('should create an action to update device', () => {
    const device = { path: '1' };
    const expectedAction = {
      type: actionTypes.setCurrentHWDevice,
      payload: device,
    };

    expect(setCurrentHWDevice(device)).toEqual(expectedAction);
  });
});
