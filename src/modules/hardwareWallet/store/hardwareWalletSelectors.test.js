import { initialState } from 'src/modules/hardwareWallet/store/hardwareWalletReducer';
import {
  selectActiveHardwareDevice,
  selectActiveHardwareDeviceId,
  selectHardwareDevices,
} from './hardwareWalletSelectors';

describe('HardwareWallet selectors', () => {
  it('Should select ActiveHardwareDevice', async () => {
    const state = { hardwareWallet: { ...initialState } };
    expect(selectActiveHardwareDevice(state)).toBeFalsy();
  });
  it('Should select ActiveHardwareDeviceId', async () => {
    const state = { hardwareWallet: { ...initialState } };
    expect(selectActiveHardwareDeviceId(state)).toEqual('');
  });
  it('Should select HardwareDevices', async () => {
    const state = { hardwareWallet: { ...initialState } };
    expect(selectHardwareDevices(state)).toEqual([]);
  });
});
