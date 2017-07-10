import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { getDelegate, getForgedBlocks, getForgedStats } from './forging';

chai.use(sinonChai);

describe('Peers', () => {
  describe('getDelegate', () => {
    it('should return a promise', () => {
      const promise = getDelegate();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('getForgedBlocks', () => {
    it('should return a promise', () => {
      const promise = getForgedBlocks();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('getForgedStats', () => {
    it('should return a promise', () => {
      const promise = getForgedStats();
      expect(typeof promise.then).to.be.equal('function');
    });
  });
});
