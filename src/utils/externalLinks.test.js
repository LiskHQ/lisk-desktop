import routes from 'src/routes/routes';
import history from 'src/utils/history';
import { IPC_OPEN_URL } from 'src/const/ipcGlobal';
import { externalLinks } from './externalLinks';

jest.mock('src/utils/history', () => ({
  push: jest.fn(),
}));

describe('externalLinks', () => {
  const ipc = {
    [IPC_OPEN_URL]: jest.fn(),
  };

  beforeEach(() => {
    ipc[IPC_OPEN_URL].mockClear();
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

  it('does not open any url', () => {
    const callbacks = {};
    window.ipc = {
      [IPC_OPEN_URL]: (callback) => {
        callbacks[IPC_OPEN_URL] = callback;
      },
    };

    externalLinks.init();
    callbacks[IPC_OPEN_URL]({}, 'lisk://register');
    expect(history.push).not.toHaveBeenCalledWith(routes.register.path);
  });

  it('does not open the send modal without query params', () => {
    const callbacks = {};
    window.ipc = {
      [IPC_OPEN_URL]: (callback) => {
        callbacks[IPC_OPEN_URL] = callback;
      },
    };

    externalLinks.init();
    callbacks[IPC_OPEN_URL]({}, 'lisk://wallet');
    expect(history.push).not.toHaveBeenCalledWith('/wallet?modal=send');
  });

  it('opens send modal with query params', () => {
    const callbacks = {};
    window.ipc = {
      [IPC_OPEN_URL]: (callback) => {
        callbacks[IPC_OPEN_URL] = callback;
      },
    };

    externalLinks.init();
    callbacks[IPC_OPEN_URL]({}, 'lisk://wallet?modal=send&recipient=lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp&amount=1&token=0200000000000000&recipientChain=02000000');
    expect(history.push).toHaveBeenCalledWith('?modal=send&recipient=lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp&amount=1&token=0200000000000000&recipientChain=02000000');
  });
});
