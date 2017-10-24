import { expect } from 'chai';
import { spy } from 'sinon';
import externalLinks from './externalLinks';

describe('externalLinks', () => {
  const ipc = {
    on: spy(),
  };

  describe('init', () => {
    it('should be a function', () => {
      expect(typeof externalLinks.init).to.be.equal('function');
    });

    it('calling init when ipc is not on window should do nothing', () => {
      externalLinks.init();
      expect(ipc.on).to.not.have.been.calledWith();
    });

    it('calling init when ipc is available on window should bind listeners', () => {
      window.ipc = ipc;
      externalLinks.init();
      expect(ipc.on).to.have.been.calledWith();
    });
  });
});
