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
    });
  });

  describe('terminate', () => {
    it('should reset running flag', () => {
      metronome.terminate();
      expect(metronome.running).to.be.equal(false);
    });
  });

  describe('dispatch', () => {
    it('should dispatch a Vanilla JS event', () => {
      const dispatchSpy = spy(document, 'dispatchEvent');
      metronome.dispatch();
      expect(dispatchSpy).to.have.been.calledWith();
    });
  });
});
