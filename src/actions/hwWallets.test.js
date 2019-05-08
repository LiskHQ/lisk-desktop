import { updateDeviceList } from './hwWallets';
import actionTypes from '../constants/actions';

describe('hwWallet Actions', () => {
  it(`Should dispatch ${actionTypes.deviceListUpdated} with deviceList`, () => {
    const data = [
      { deviceId: 1, openApp: false, model: 'Ledger' },
      { deviceId: 2, model: 'Trezor' },
      { deviceId: 3, openApp: true, model: 'Ledger' },
    ];
    const expectedAction = {
      data,
      type: actionTypes.deviceListUpdated,
    };
    expect(updateDeviceList(data)).toEqual(expectedAction);
  });
});
