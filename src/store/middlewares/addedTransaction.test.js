import { expect } from 'chai';
import { spy, stub } from 'sinon';
import i18next from 'i18next';
import { successAlertDialogDisplayed } from '../../actions/dialog';
import middleware from './addedTransaction';
import actionTypes from '../../constants/actions';

describe('addedTransaction middleware', () => {
  let store;
  let next;

  beforeEach(() => {
    store = stub();
    store.getState = () => ({
      peers: {
        data: {},
      },
      account: {},
    });
    store.dispatch = spy();
    next = spy();
  });

  it('should passes the action to next middleware', () => {
    const givenAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(givenAction);
    expect(next).to.have.been.calledWith(givenAction);
  });

  it('fire success dialog action with appropriate text ', () => {
    const givenAction = {
      type: actionTypes.transactionAdded,
      data: {
        username: 'test',
        amount: 1e8,
        recipientId: '16313739661670634666L',
      },
    };

    const expectedMessages = [
      'Your transaction of 1 LSK to 16313739661670634666L was accepted and will be processed in a few seconds.',
      'Second passphrase registration was successfully submitted. It can take several seconds before it is processed.',
      'Delegate registration was successfully submitted with username: "test". It can take several seconds before it is processed.',
      'Your votes were successfully submitted. It can take several seconds before they are processed.',
    ];

    for (let i = 0; i < 4; i++) {
      givenAction.data.type = i;
      middleware(store)(next)(givenAction);
      const expectedAction = successAlertDialogDisplayed({ text: i18next.t(expectedMessages[i]) });
      expect(store.dispatch).to.have.been.calledWith(expectedAction);
    }
  });
});

