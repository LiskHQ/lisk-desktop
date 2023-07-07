import routes from 'src/routes/routes';
import history from 'src/utils/history';
import { IPC_OPEN_URL } from 'src/const/ipcGlobal';
import { externalLinks } from './externalLinks';

jest.mock('src/utils/history', () => ({
  push: jest.fn(),
  replace: jest.fn(),
}));

describe('externalLinks', () => {
  const ipc = {
    [IPC_OPEN_URL]: jest.fn(),
  };

  beforeEach(() => {
    ipc[IPC_OPEN_URL].mockClear();
    history.replace.mockReset();
    history.push.mockReset();
  });

  it('calling init when ipc is not on window should do nothing', () => {
    window.ipc = null;
    externalLinks.init();
    expect(ipc[IPC_OPEN_URL]).not.toHaveBeenCalled();
  });

  it('calling init when ipc is available on window should bind listeners', () => {
    window.ipc = ipc;
    externalLinks.init();
    expect(ipc[IPC_OPEN_URL]).toHaveBeenCalled();
  });

  it('opens url', () => {
    const callbacks = {};
    window.ipc = {
      [IPC_OPEN_URL]: (callback) => {
        callbacks[IPC_OPEN_URL] = callback;
      },
    };

    externalLinks.init();
    callbacks[IPC_OPEN_URL]({}, 'lisk://register');
    expect(history.replace).toHaveBeenCalledWith(routes.register.path);
  });

  it('opens send modal without query params', () => {
    const callbacks = {};
    window.ipc = {
      [IPC_OPEN_URL]: (callback) => {
        callbacks[IPC_OPEN_URL] = callback;
      },
    };

    externalLinks.init();
    callbacks[IPC_OPEN_URL]({}, 'lisk://wallet');
    expect(history.replace).toHaveBeenCalledWith('/wallet?modal=send');
  });

  it('opens send modal with query params', () => {
    const callbacks = {};
    window.ipc = {
      [IPC_OPEN_URL]: (callback) => {
        callbacks[IPC_OPEN_URL] = callback;
      },
    };

    externalLinks.init();
    callbacks[IPC_OPEN_URL]({}, 'lisk://wallet?recipient=1L&amount=100');
    expect(history.replace).toHaveBeenCalledWith('/wallet?modal=send&recipient=1L&amount=100');
  });

  it('opens staking queue modal', () => {
    const callbacks = {};
    window.ipc = {
      [IPC_OPEN_URL]: (callback) => {
        callbacks[IPC_OPEN_URL] = callback;
      },
    };

    externalLinks.init();
    callbacks[IPC_OPEN_URL]({}, 'lisk://stake?stakes=validator');
    expect(history.replace).toHaveBeenCalledWith('/wallet?modal=StakingQueue&stakes=validator');
  });
});
