import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import dialogs from './dialog';
import actionTypes from '../../constants/actions';


chai.use(sinonChai);

describe('Reducer: dialogs(state, action)', () => {
  let state;

  beforeEach(() => {
    state = { key: 'sign-message' };
  });

  it('should return dialogs array with the new dialog if action.type = actionTypes.dialogDisplayed', () => {
    const action = {
      type: actionTypes.dialogDisplayed,
      data: {
        key: 'verify-message',
      },
    };
    const changedState = dialogs(state, action);
    expect(changedState).to.deep.equal({
      key: 'verify-message',
    });
  });

  it('should return empty account obejct if action.type = actionTypes.accountLoggedOut', () => {
    const action = {
      type: actionTypes.dialogHidden,
    };
    const changedState = dialogs(state, action);
    expect(changedState).to.deep.equal({});
  });
});

