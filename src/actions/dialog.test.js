import { expect } from 'chai';
import actionTypes from '../constants/actions';
import {
  dialogDisplayed,
  alertDialogDisplayed,
  successAlertDialogDisplayed,
  errorAlertDialogDisplayed,
  dialogHidden,
} from './dialog';
import Alert from '../components/dialog/alert';


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

  describe('alertDialogDisplayed', () => {
    it('should create an action to show alert dialog', () => {
      const data = {
        title: 'success',
        text: 'some text',
      };

      const expectedAction = {
        data: {
          title: data.title,
          type: undefined,
          childComponent: Alert,
          childComponentProps: {
            text: data.text,
          },
        },
        type: actionTypes.dialogDisplayed,
      };
      expect(alertDialogDisplayed(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('successAlertDialogDisplayed', () => {
    it('should create an action to show alert dialog', () => {
      const data = {
        text: 'some text',
      };

      const expectedAction = {
        data: {
          title: 'Success',
          type: 'success',
          childComponent: Alert,
          childComponentProps: {
            text: data.text,
          },
        },
        type: actionTypes.dialogDisplayed,
      };
      expect(successAlertDialogDisplayed(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('errorAlertDialogDisplayed', () => {
    it('should create an action to show alert dialog', () => {
      const data = {
        text: 'some text',
      };

      const expectedAction = {
        data: {
          title: 'Error',
          type: 'error',
          childComponent: Alert,
          childComponentProps: {
            text: data.text,
          },
        },
        type: actionTypes.dialogDisplayed,
      };
      expect(errorAlertDialogDisplayed(data)).to.be.deep.equal(expectedAction);
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
