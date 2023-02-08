import { IPC_MESSAGES } from '@libs/hwServer/constants';
import { HWClient } from './HWClient';

describe('HWClient', () => {
  const ipcOnMock = jest.fn();
  const ipcOnceMock = jest.fn();
  const ipcSendMock = jest.fn();

  const windowSpy = jest.spyOn(window, 'window', 'get');
  windowSpy.mockImplementation(() => ({
    ipc: { once: ipcOnceMock, send: ipcSendMock, on: ipcOnMock},
  }));

  const hWClient = new HWClient();
  let hwClientOnceMock;

  beforeEach(() => {
    hwClientOnceMock = jest.spyOn(hWClient, "once");
  });

  afterEach(() => {
    ipcOnMock.mockRestore();
    ipcSendMock.mockRestore();
    ipcOnceMock.mockRestore();
    hwClientOnceMock.mockRestore();
  });

  const payload = {
    action: 'someAction',
    data: {
      index: 1,
    },
  }

  test('executeCommand', () => {
    hWClient.executeCommand(payload);
    expect(hwClientOnceMock).toHaveBeenCalledWith(IPC_MESSAGES.HW_COMMAND, payload);
    expect(ipcOnceMock).toHaveBeenCalled();
    expect(ipcSendMock).toHaveBeenCalled();
  });

  test('invoke', () => {
    hWClient.invoke(payload);
    expect(hwClientOnceMock).toHaveBeenCalledWith(IPC_MESSAGES.INVOKE, payload);
    expect(ipcOnceMock).toHaveBeenCalled();
    expect(ipcSendMock).toHaveBeenCalled();
  });

  test('subscribe', () => {
    const args = [IPC_MESSAGES.DEVICE_LIST_CHANGED, jest.fn()]
    hWClient.subscribe(...args);
    expect(ipcOnMock).toHaveBeenCalledWith(...args);
  });

  test('once', () => {
    hWClient.once(IPC_MESSAGES.INVOKE, payload);
    expect(hwClientOnceMock).toHaveBeenCalledWith(IPC_MESSAGES.INVOKE, payload);
    expect(ipcOnceMock).toHaveBeenCalled();
    expect(ipcSendMock).toHaveBeenCalled();
  });
});
