import { expect } from 'chai';
import actionTypes from './actionTypes';
import { loadingStarted, loadingFinished } from './actions';

describe('actions: loading', () => {
  describe('loadingStarted', () => {
    it('should create an action to show loading bar', () => {
      const data = 'test';

      const expectedAction = {
        data,
        type: actionTypes.loadingStarted,
      };
      expect(loadingStarted(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('loadingFinished', () => {
    it('should create an action to hide loading bar', () => {
      const data = 'test';

      const expectedAction = {
        data,
        type: actionTypes.loadingFinished,
      };
      expect(loadingFinished(data)).to.be.deep.equal(expectedAction);
    });
  });
});
