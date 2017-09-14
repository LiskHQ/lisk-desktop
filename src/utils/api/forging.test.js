import { expect } from 'chai';
import { getForgedBlocks, getForgedStats } from './forging';


describe('Utils: Forging', () => {
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
