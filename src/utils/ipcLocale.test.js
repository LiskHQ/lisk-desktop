import { expect } from 'chai';
import { spy } from 'sinon';
import ipcLocale from './ipcLocale';

describe('ipcLocale', () => {
  const ipc = {
    on: spy(),
    send: spy(),
  };

  const i18n = {
    changeLanguage: spy(),
    on: spy(),
  };

  describe('init', () => {
    beforeEach(() => {
      delete window.ipc;
    });
    it('calling init when ipc is not on window should do nothing', () => {
      ipcLocale.init();
      expect(ipc.on).to.not.have.been.calledWith();
      expect(ipc.send).to.not.have.been.calledWith();
    });

    it('should be a function', () => {
      expect(typeof ipcLocale.init).to.be.equal('function');
    });

    it('calling init when ipc is available on window should bind listeners', () => {
      window.ipc = ipc;
      ipcLocale.init(i18n);
      expect(ipc.on).to.have.been.calledWith();
      expect(i18n.on).to.have.been.calledWith();
    });
  });
});
