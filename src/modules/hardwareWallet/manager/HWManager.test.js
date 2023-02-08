import { IPC_MESSAGES } from '@libs/hwServer/constants';
import { mockAccounts } from 'src/modules/hardwareWallet/__fixtures__';
import hwManager from './HWManager';

jest.useRealTimers();
jest.spyOn(hwManager, 'once');

describe('HWManager', () => {
  afterEach(() => {
    hwManager.once.mockClear();
  });

  test.skip('createAccount', () => {
    hwManager.once.mockImplementation((_event, handler) => {
      handler(null, { success: true, data: 'SOME_DATA' });
    });
    hwManager.createAccount();

    expect({}).toBe(mockAccounts);
  });

  test('getDevices', async () => {
    hwManager.once.mockImplementation(() => mockAccounts);
    const accounts = await hwManager.getDevices();

    expect(hwManager.once).toHaveBeenCalledWith(IPC_MESSAGES.INVOKE, { action: 'getDevices' });
    expect(accounts).toBe(mockAccounts);
  });

  test('getActiveDeviceInfo', async () => {
    hwManager.once.mockImplementation(() => mockAccounts);
    const accounts = await hwManager.getActiveDeviceInfo();

    expect(hwManager.once).toHaveBeenCalledWith(IPC_MESSAGES.INVOKE, {
      action: 'getActiveDevices',
    });
    expect(accounts).toBe(mockAccounts);
  });

  test('getDeviceInfoByID', async () => {
    hwManager.once.mockImplementation(() => mockAccounts);
    await hwManager.getDeviceInfoByID('TEST');

    expect(hwManager.once).toHaveBeenCalledWith(IPC_MESSAGES.INVOKE, {
      action: 'getDeviceById',
      data: { id: 'TEST' },
    });
  });

  test('selectDevice', async () => {
    hwManager.once.mockImplementation(() => mockAccounts);
    await hwManager.selectDevice('TEST');

    expect(hwManager.once).toHaveBeenCalledWith(IPC_MESSAGES.INVOKE, {
      action: 'selectDevice',
      data: { id: 'TEST' },
    });
  });

  test('getPublicKey', async () => {
    hwManager.once.mockImplementation(() => mockAccounts);
    await hwManager.getPublicKey(1);

    expect(hwManager.once).toHaveBeenCalledWith(IPC_MESSAGES.HW_COMMAND, {
      action: 'GET_PUBLIC_KEY',
      data: { index: 1 },
    });
  });

  test('signTransaction', async () => {
    hwManager.once.mockImplementation(() => mockAccounts);
    await hwManager.signTransaction(1, 'TEST_CHAIN_ID', 'TEST_TX');

    expect(hwManager.once).toHaveBeenCalledWith(IPC_MESSAGES.HW_COMMAND, {
      action: 'SIGN_TX',
      data: { index: 1, chainID: 'TEST_CHAIN_ID', transactionBytes: 'TEST_TX' },
    });
  });

  test('signMessage', async () => {
    hwManager.once.mockImplementation(() => mockAccounts);
    await hwManager.signMessage(1, 'TEST');

    expect(hwManager.once).toHaveBeenCalledWith(IPC_MESSAGES.HW_COMMAND, {
      action: 'SIGN_MSG',
      data: { index: 1, message: 'TEST' },
    });
  });

  test('checkAppStatus', async () => {
    hwManager.once.mockImplementation(() => mockAccounts);
    await hwManager.checkAppStatus();

    expect(hwManager.once).toHaveBeenNthCalledWith(1, IPC_MESSAGES.INVOKE, {
      action: 'checkLedger',
    });
    expect(hwManager.once).toHaveBeenNthCalledWith(2, IPC_MESSAGES.INVOKE, {
      action: 'getDevices',
    });
  });
});
