import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import Metronome from './metronome';
import { SYNC_ACTIVE_INTERVAL } from '../constants/api';

chai.use(sinonChai);

describe('Metronome', () => {
  let metronome;

  beforeEach(() => {
    metronome = new Metronome();
  });

  afterEach(() => {
    metronome.terminate();
  });

  it('defines initial settings', () => {
    expect(metronome.interval).to.be.equal(SYNC_ACTIVE_INTERVAL);
    expect(metronome.running).to.be.equal(false);
    expect(metronome.factor).to.be.equal(0);
  });

  describe('init', () => {
    it('should call requestAnimationFrame', () => {
      const reqSpy = spy(window, 'requestAnimationFrame');
      metronome.init();
      expect(reqSpy).to.have.been.calledWith();
      window.requestAnimationFrame.restore();
    });
  });

  describe('terminate', () => {
    it('should reset running flag', () => {
      metronome.terminate();
      expect(metronome.running).to.be.equal(false);
    });
  });

  describe('_dispatch', () => {
    it('should dispatch a Vanilla JS event', () => {
      const dispatchSpy = spy(document, 'dispatchEvent');
      Metronome._dispatch();
      expect(dispatchSpy).to.have.been.calledWith();
    });
  });

  describe('_step', () => {
    it('should call requestAnimationFrame every 10 sec', () => {
      const reqSpy = spy(window, 'requestAnimationFrame');
      metronome.running = true;
      metronome._step();
      expect(reqSpy).to.have.been.calledWith();
      window.requestAnimationFrame.restore();
    });

    it('should never call requestAnimationFrame if running is false', () => {
      const reqSpy = spy(window, 'requestAnimationFrame');
      metronome._step();
      expect(reqSpy).not.have.been.calledWith();
      window.requestAnimationFrame.restore();
    });

    it('should reset the factor after 10 times', () => {
      for (let i = 1; i < 12; i++) {
        metronome.lastBeat -= 10001;
        metronome._step();
        if (i < 10) {
          expect(metronome.factor).to.be.equal(i);
        } else {
          expect(metronome.factor).to.be.equal(i - 10);
        }
      }
    });

    it('should call _dispatch if lastBeat is older that 10sec', () => {
      const reqSpy = spy(Metronome, '_dispatch');
      metronome.running = true;

      const now = new Date();
      metronome.lastBeat = now - 20000;
      metronome._step();
      expect(reqSpy).to.have.been.calledWith();
      Metronome._dispatch.restore();
    });
  });
});
