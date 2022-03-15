import { routes } from '@constants';
import externalLinks from './externalLinks';
import history from '../history';

jest.mock('../history', () => ({
  push: jest.fn(), replace: jest.fn(),
}));

describe('externalLinks', () => {
  const ipc = {
    on: jest.fn(),
  };

  beforeEach(() => {
    ipc.on.mockClear();
    history.replace.mockReset();
    history.push.mockReset();
  });

  it('calling init when ipc is not on window should do nothing', () => {
    window.ipc = null;
    externalLinks.init();
    expect(ipc.on).not.toHaveBeenCalled();
  });

  it('calling init when ipc is available on window should bind listeners', () => {
    window.ipc = ipc;
    externalLinks.init();
    expect(ipc.on).toHaveBeenCalled();
  });

  it('opens url', () => {
    const callbacks = {};
    window.ipc = {
      on: (event, callback) => { callbacks[event] = callback; },
    };

    externalLinks.init();
    callbacks.openUrl({}, 'lisk://register');
    expect(history.replace).toHaveBeenCalledWith(routes.register.path);
  });

  it('opens send modal without query params', () => {
    const callbacks = {};
    window.ipc = {
      on: (event, callback) => { callbacks[event] = callback; },
    };

    externalLinks.init();
    callbacks.openUrl({}, 'lisk://wallet');
    expect(history.replace).toHaveBeenCalledWith('/wallet?modal=send');
  });

  it('opens send modal with query params', () => {
    const callbacks = {};
    window.ipc = {
      on: (event, callback) => { callbacks[event] = callback; },
    };

    externalLinks.init();
    callbacks.openUrl({}, 'lisk://wallet?recipient=1L&amount=100');
    expect(history.replace).toHaveBeenCalledWith('/wallet?modal=send&recipient=1L&amount=100');
  });

  it('opens voting queue modal', () => {
    const callbacks = {};
    window.ipc = {
      on: (event, callback) => { callbacks[event] = callback; },
    };

    externalLinks.init();
    callbacks.openUrl({}, 'lisk://vote?votes=delegate');
    expect(history.replace).toHaveBeenCalledWith('/wallet?modal=votingQueue&votes=delegate');
  });
});
