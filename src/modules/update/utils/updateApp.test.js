import { toast } from 'react-toastify';
import updateApp from './updateApp';

jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    update: jest.fn(),
  },
}));

describe('updateApp', () => {
  const ipc = {
    on: jest.fn(),
  };

  beforeEach(() => {
    ipc.on.mockClear();
  });

  it('calling init when ipc is not on window should do nothing', () => {
    window.ipc = null;
    updateApp.init();
    expect(ipc.on).not.toHaveBeenCalled();
  });

  it('calling init when ipc is available on window should bind listeners', () => {
    window.ipc = ipc;
    updateApp.init();
    expect(ipc.on).toHaveBeenCalled();
  });

  it('should create toast when downloadUpdateStart', () => {
    const callbacks = {};
    window.ipc = {
      on: (event, callback) => {
        callbacks[event] = callback;
      },
    };

    updateApp.init();
    callbacks.downloadUpdateStart();
    expect(toast.info).toHaveBeenCalled();
  });

  it('should when toast when downloadUpdateProgress', () => {
    const callbacks = {};
    window.ipc = {
      on: (event, callback) => {
        callbacks[event] = callback;
      },
    };

    updateApp.init();
    callbacks.downloadUpdateProgress({}, { transferred: 50, total: 100 });
    expect(toast.update).toHaveBeenCalled();
  });

  it('should when toast when downloadUpdateCompleted', () => {
    const callbacks = {};
    window.ipc = {
      on: (event, callback) => {
        callbacks[event] = callback;
      },
    };

    updateApp.init();
    callbacks.downloadUpdateCompleted();
    expect(toast.update).toHaveBeenCalled();
  });
});
