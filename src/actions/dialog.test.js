import { expect } from 'chai';
import actionTypes from '../constants/actions';
import { dialogDisplayed, dialogHidden } from './dialog';

describe('actions: dialog', () => {
  describe('dialogDisplayed', () => {
    it('should create an action to show dialog', () => {
      const data = {
        component: 'dummy',
        props: {},
      };

      const expectedAction = {
        data,
        type: actionTypes.dialogDisplayed,
      };
      expect(dialogDisplayed(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('dialogHidden', () => {
    it('should create an action to hide dialog', () => {
      const expectedAction = {
        type: actionTypes.dialogHidden,
      };
      expect(dialogHidden()).to.be.deep.equal(expectedAction);
    });
  });
});
