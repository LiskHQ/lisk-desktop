import { expect } from 'chai';
import sinon from 'sinon';
import { loadingStarted, loadingFinished } from './lsk';


describe.skip('loading utils', () => {
  describe('loadingStarted', () => {
    sinon.mock();
    it('should call store.dispatch(loadingStartedAction(data))', () => {
      loadingStarted('test');
      expect().to.be.equal('1');
    });
  });

  describe('loadingFinished', () => {
    it('should convert 1 to 100000000', () => {
      expect(loadingFinished(1)).to.be.equal(100000000);
    });
  });
});
