import { devicesListUpdated } from './hwWallets';
import actionTypes from '../constants/actions';

describe('hwWallet Actions', () => {
  it(`Should dispatch ${actionTypes.devicesListUpdate} with deviceList`, () => {
    const data = [
      { deviceId: 1, openApp: false, model: 'Ledger' },
      { deviceId: 2, model: 'Trezor' },
      { deviceId: 3, openApp: true, model: 'Ledger' },
    ];
    const expectedAction = {
      data,
      type: actionTypes.devicesListUpdate,
    };
    expect(devicesListUpdated(data)).toEqual(expectedAction);
  });
});
