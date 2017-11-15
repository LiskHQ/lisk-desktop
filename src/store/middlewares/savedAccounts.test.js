import { expect } from 'chai';
import { spy, mock } from 'sinon';

import { accountLoggedOut } from '../../actions/account';
import { successToastDisplayed } from '../../actions/toaster';
import actionTypes from '../../constants/actions';
import middleware from './savedAccounts';

describe('SavedAccounts middleware', () => {
  let store;
  let next;

  beforeEach(() => {
    store = mock();
    store.dispatch = spy();
    store.getState = () => ({});

    next = spy();
  });

  it('should pass the action to next middleware', () => {
    const randomAction = {
      type: 'SOME_ACTION',
      data: { something: true },
    };

    middleware(store)(next)(randomAction);
    expect(next).to.have.been.calledWith(randomAction);
  });

  it(`should dispatch successToastDisplayed action on ${actionTypes.accountSaved} action`, () => {
    const action = {
      type: actionTypes.accountSaved,
      data: {},
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(successToastDisplayed({ label: 'Account saved' }));
  });

  it(`should dispatch successToastDisplayed action on ${actionTypes.accountRemoved} action`, () => {
    const action = {
      type: actionTypes.accountRemoved,
      data: {},
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(successToastDisplayed({ label: 'Account was successfully forgotten.' }));
  });

  it(`should dispatch accountLoggedOut action on ${actionTypes.accountSwitched} action`, () => {
    const action = {
      type: actionTypes.accountSwitched,
      data: {
        publicKey: '',
        network: 0,
      },
    };
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(accountLoggedOut());
  });
});
