import { expect } from 'chai';
import actionTypes from '../constants/actions';
import {
  secondPassphraseRegisteredFailure,
  secondPassphraseRegisteredFailureReset,
} from './secondPassphrase';

describe('actions: secondPassphrase', () => {
  describe('secondPassphraseRegisteredFailure', () => {
    it('should create an action to show secondPassphraseRegisteredFailure', () => {
      const text = 'message';
      const expectedAction = {
        text,
        type: actionTypes.secondPassphraseRegisteredFailure,
      };
      expect(secondPassphraseRegisteredFailure({ text })).to.be.deep.equal(expectedAction);
    });
  });
  describe('secondPassphraseRegisteredFailureReset', () => {
    it('should create an action to hide secondPassphraseRegisteredFailureReset', () => {
      const expectedAction = {
        type: actionTypes.secondPassphraseRegisteredFailureReset,
      };
      expect(secondPassphraseRegisteredFailureReset()).to.be.deep.equal(expectedAction);
    });
  });
});
