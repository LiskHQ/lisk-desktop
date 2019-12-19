import {
  forgingDataDisplayed,
  forgingDataConcealed,
} from './blocks';
import actionTypes from '../constants/actions';

describe('actions: blocks', () => {
  describe('forgingDataDisplayed', () => {
    it('should return a pure action object', () => {
      expect(forgingDataDisplayed()).toEqual({ type: actionTypes.forgingDataDisplayed });
    });
  });

  describe('forgingDataConcealed', () => {
    it('should return a pure action object', () => {
      expect(forgingDataConcealed()).toEqual({ type: actionTypes.forgingDataConcealed });
    });
  });
});
