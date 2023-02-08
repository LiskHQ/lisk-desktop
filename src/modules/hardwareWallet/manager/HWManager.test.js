import { mockAccounts, mockDevices } from 'src/modules/hardwareWallet/__fixtures__';
import HWManager from './HWManager';

describe("HWManager", () => {
  test("createAccount", () => {
    HWManager.createAccount();

    expect({}).toBe(mockAccounts);
  });

  test("getAccounts", () => {
    const accounts = HWManager.getAccounts();

    expect(accounts).toBe(mockAccounts);
  });

  test("getDeviceList", () => {
    const devices = HWManager.getDeviceList();

    expect(devices).toBe(mockDevices);
  });

  test("getCurrentDeviceInfo", () => {
    const currentDevice = HWManager.getCurrentDeviceInfo();

    expect(currentDevice).toBe(mockDevices);
  });

  test("getDeviceInfoByID", () => {
    const deviceInfoByID = HWManager.getDeviceInfoByID();

    expect(deviceInfoByID).toBe(mockDevices);
  });

  test("selectDevice", () => {
    const firstDeviceId = mockDevices[0].id;
    HWManager.selectDevice(firstDeviceId);

    expect(firstDeviceId).toBe(HWManager.activeDeviceID);
  });

  test("getPublicKey", () => {
    const publicKey = HWManager.getPublicKey();

    expect(publicKey).toBe('12sadf123');
  });

  test("getAddress", () => {
    const address = HWManager.getAddress(1);

    expect(address).toBe('1lsk...');
  });

  test("signMessage", () => {
    const signedMsg = HWManager.signMessage(1, Buffer.from('hello'));

    expect(signedMsg).toBe(Buffer.from('hello'));
  });

  test("signTransaction", () => {
    const signedTrx = HWManager.signTransaction(1, Buffer.from('68656c6c6f'));

    expect(signedTrx).toBe(Buffer.from(Buffer.from('68656c6c6f')));
  });

  test("checkIfInsideLiskApp", () => {
    const isInsideLiskApp = HWManager.checkIfInsideLiskApp(1);

    expect(isInsideLiskApp).toBe(true);
  });
});