import { expect } from 'chai';
import { spy } from 'sinon';
import Metronome from './metronome';
import { SYNC_ACTIVE_INTERVAL, SYNC_INACTIVE_INTERVAL } from '../constants/api';
import env from '../constants/env';


describe('Metronome', () => {
  let metronome;
  const spyDispatch = spy();

  beforeEach(() => {
    metronome = new Metronome(spyDispatch);
  });

  afterEach(() => {
    metronome.terminate();
  });

  it('defines initial settings', () => {
    expect(metronome.interval).to.be.equal(SYNC_ACTIVE_INTERVAL);
    expect(metronome.running).to.be.equal(false);
    expect(metronome.factor).to.be.equal(0);
    expect(metronome.dispatchFn).to.be.equal(spyDispatch);
  });

  describe('init', () => {
    it('should call requestAnimationFrame if !this.running', () => {
      const reqSpy = spy(window, 'requestAnimationFrame');
      metronome.init();
      expect(reqSpy).to.have.been.calledWith();
      window.requestAnimationFrame.restore();
    });

    it('should not call requestAnimationFrame if this.running', () => {
      const reqSpy = spy(window, 'requestAnimationFrame');
      metronome.running = true;
      metronome.init();
      expect(reqSpy).to.not.have.been.calledWith();
      window.requestAnimationFrame.restore();
    });

    it('should call window.ipc.on(\'blur\') and window.ipc.on(\'focus\')', () => {
      window.ipc = {
        on: spy(),
      };
      env.production = true;
      metronome.init();
      expect(window.ipc.on).to.have.been.calledWith('blur');
      expect(window.ipc.on).to.have.been.calledWith('focus');
    });

    it('should set window.ipc to set this.interval to SYNC_INACTIVE_INTERVAL on blur', () => {
      const callbacks = {};
      window.ipc = {
        on: (type, callback) => {
          callbacks[type] = callback;
        },
      };
      env.production = true;
      metronome.init();
      callbacks.blur();
      expect(metronome.interval).to.equal(SYNC_INACTIVE_INTERVAL);
    });

    it('should set window.ipc to set this.interval to SYNC_ACTIVE_INTERVAL on focus', () => {
      const callbacks = {};
      window.ipc = {
        on: (type, callback) => {
          callbacks[type] = callback;
        },
      };
      env.production = true;
      metronome.init();
      callbacks.blur();
      expect(metronome.interval).to.equal(SYNC_INACTIVE_INTERVAL);
      callbacks.focus();
      expect(metronome.interval).to.equal(SYNC_ACTIVE_INTERVAL);
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
      metronome._dispatch();
      expect(spyDispatch).to.have.been.calledWith();
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
      const reqSpy = spy(metronome, '_dispatch');
      metronome.running = true;

      const now = new Date();
      metronome.lastBeat = now - 20000;
      metronome._step();
      expect(reqSpy).to.have.been.calledWith();
      metronome._dispatch.restore();
    });
  });
});
