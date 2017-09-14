import { expect } from 'chai';
import actionTypes from '../constants/actions';
import { toastDisplayed, successToastDisplayed, errorToastDisplayed, toastHidden } from './toaster';

describe('actions: toaster', () => {
  const data = {
    label: 'dummy',
  };

  describe('toastDisplayed', () => {
    it('should create an action to show toast', () => {
      const expectedAction = {
        data,
        type: actionTypes.toastDisplayed,
      };
      expect(toastDisplayed(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('successToastDisplayed', () => {
    it('should create an action to show success toast', () => {
      const expectedAction = {
        data: { ...data, type: 'success' },
        type: actionTypes.toastDisplayed,
      };
      expect(successToastDisplayed(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('errorToastDisplayed', () => {
    it('should create an action to show error toast', () => {
      const expectedAction = {
        data: { ...data, type: 'error' },
        type: actionTypes.toastDisplayed,
      };
      expect(errorToastDisplayed(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('toastHidden', () => {
    it('should create an action to hide toast', () => {
      const expectedAction = {
        data,
        type: actionTypes.toastHidden,
      };
      expect(toastHidden(data)).to.be.deep.equal(expectedAction);
    });
  });
});
