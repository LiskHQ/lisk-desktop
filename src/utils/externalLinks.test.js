import { expect } from 'chai';
import { spy, mock } from 'sinon';
import externalLinks from './externalLinks';
import history from '../history';
import routes from '../constants/routes';

describe('externalLinks', () => {
  const historyMock = mock(history);
  const ipc = {
    on: spy(),
  };

  it('calling init when ipc is not on window should do nothing', () => {
    window.ipc = null;
    externalLinks.init();
    expect(ipc.on).to.not.have.been.calledWith();
  });

  it('calling init when ipc is available on window should bind listeners', () => {
    window.ipc = ipc;
    externalLinks.init();
    expect(ipc.on).to.have.been.calledWith();
  });

  it('opens url', () => {
    const callbacks = {};
    window.ipc = {
      on: (event, callback) => { callbacks[event] = callback; },
    };

    externalLinks.init();
    callbacks.openUrl({}, 'lisk://register');
    historyMock.expects('replace').once().withArgs(routes.registerV2.path);
  });
});
