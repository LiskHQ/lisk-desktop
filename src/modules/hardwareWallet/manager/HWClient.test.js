import { HWClient } from './HWClient';

jest.useRealTimers();
const waitFor = (time) =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

describe('HWClient', () => {
  beforeEach(() => {
    window.ipc = {
      once: jest.fn(),
      send: jest.fn(),
      on: jest.fn(),
    };
  });

  test('exposes "once" to communicate over IPC', async () => {
    const hwClient = new HWClient();
    window.ipc.once.mockImplementation(async (_event, handler) => {
      await waitFor(1);
      return handler(null, { success: true, data: 'SOME_DATA' });
    });
    await hwClient.once('EVENT_NAME', { id: 'TEST' });
    expect(window.ipc.send).toHaveBeenCalledWith('EVENT_NAME.request', { id: 'TEST' });
    expect(window.ipc.once).toHaveBeenCalledWith('EVENT_NAME.result', expect.any(Function));
  });

  test('exposes "executeCommand" to communicate using the "once" method', () => {
    const hwClient = new HWClient();
    hwClient.once = jest.fn();
    hwClient.executeCommand({ id: 'TEST' });
    expect(hwClient.once).toHaveBeenCalledWith('hwCommand', { id: 'TEST' });
  });

  test('exposes "invoke" to communicate using the "once" method', () => {
    const hwClient = new HWClient();
    hwClient.once = jest.fn();
    hwClient.invoke({ id: 'TEST' });
    expect(hwClient.once).toHaveBeenCalledWith('INVOKE', { id: 'TEST' });
  });

  test('exposes "subscribe" to subscribe to events over IPC', () => {
    const hwClient = new HWClient();
    hwClient.subscribe('EVENT_NAME', 'CALLBACK');
    expect(window.ipc.on).toHaveBeenCalledWith('EVENT_NAME', 'CALLBACK');
  });
});
