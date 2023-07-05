import { toast } from 'react-toastify';
import {
  IPC_DOWNLOAD_UPDATE_COMPLETED,
  IPC_DOWNLOAD_UPDATE_PROGRESS,
  IPC_DOWNLOAD_UPDATE_START,
} from 'src/const/ipcGlobal';
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
    [IPC_DOWNLOAD_UPDATE_START]: jest.fn(),
    [IPC_DOWNLOAD_UPDATE_PROGRESS]: jest.fn(),
    [IPC_DOWNLOAD_UPDATE_COMPLETED]: jest.fn(),
  };

  beforeEach(() => {
    ipc.on.mockClear();
  });

  it('calling init when ipc is not on window should do nothing', () => {
    window.ipc = null;
    updateApp.init();
    expect(ipc[IPC_DOWNLOAD_UPDATE_START]).not.toHaveBeenCalled();
  });

  it('calling init when ipc is available on window should bind listeners', () => {
    window.ipc = ipc;
    updateApp.init();
    expect(ipc[IPC_DOWNLOAD_UPDATE_START]).toHaveBeenCalled();
  });

  it('should create toast when IPC_DOWNLOAD_UPDATE_START', () => {
    const callbacksStart = {};
    window.ipc = {
      [IPC_DOWNLOAD_UPDATE_START]: (callback) => {
        callbacksStart[IPC_DOWNLOAD_UPDATE_START] = callback;
      },
      [IPC_DOWNLOAD_UPDATE_PROGRESS]: (callback) => {
        callbacksStart[IPC_DOWNLOAD_UPDATE_PROGRESS] = callback;
      },
      [IPC_DOWNLOAD_UPDATE_COMPLETED]: (callback) => {
        callbacksStart[IPC_DOWNLOAD_UPDATE_COMPLETED] = callback;
      },
    };

    updateApp.init();
    callbacksStart[IPC_DOWNLOAD_UPDATE_START]();
    expect(toast.info).toHaveBeenCalled();
  });

  it('should when toast when IPC_DOWNLOAD_UPDATE_PROGRESS', () => {
    const callbacksProgress = {};
    window.ipc = {
      [IPC_DOWNLOAD_UPDATE_START]: (callback) => {
        callbacksProgress[IPC_DOWNLOAD_UPDATE_START] = callback;
      },
      [IPC_DOWNLOAD_UPDATE_PROGRESS]: (callback) => {
        callbacksProgress[IPC_DOWNLOAD_UPDATE_PROGRESS] = callback;
      },
      [IPC_DOWNLOAD_UPDATE_COMPLETED]: (callback) => {
        callbacksProgress[IPC_DOWNLOAD_UPDATE_COMPLETED] = callback;
      },
    };

    updateApp.init();
    callbacksProgress[IPC_DOWNLOAD_UPDATE_PROGRESS]({}, { transferred: 50, total: 100 });
    expect(toast.update).toHaveBeenCalled();
  });

  it('should when toast when IPC_DOWNLOAD_UPDATE_COMPLETED', () => {
    const callbacksCompleted = {};
    window.ipc = {
      [IPC_DOWNLOAD_UPDATE_START]: (callback) => {
        callbacksCompleted[IPC_DOWNLOAD_UPDATE_START] = callback;
      },
      [IPC_DOWNLOAD_UPDATE_PROGRESS]: (callback) => {
        callbacksCompleted[IPC_DOWNLOAD_UPDATE_PROGRESS] = callback;
      },
      [IPC_DOWNLOAD_UPDATE_COMPLETED]: (callback) => {
        callbacksCompleted[IPC_DOWNLOAD_UPDATE_COMPLETED] = callback;
      },
    };

    updateApp.init();
    callbacksCompleted[IPC_DOWNLOAD_UPDATE_COMPLETED]();
    expect(toast.update).toHaveBeenCalled();
  });
});
