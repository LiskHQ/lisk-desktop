import { expect } from 'chai';
import actionTypes from '../../constants/actions';
import delegate from './delegate';

describe('Reducer: delegate(state, action)', () => {
  let state;

  beforeEach(() => {
    state = {
    };
  });

  it('should redirect to register step success when account updated with delegate', () => {
    const action = {
      type: actionTypes.accountUpdated,
      data: {
        delegate: {},
        isDelegate: true,
      },
    };
    const stateRegisterSuccess = delegate(state, action);
    expect(stateRegisterSuccess).to.deep.equal({
      registerStep: 'register-success',
    });
  });

  it('should redirect to register step failure when register failure', () => {
    const action = {
      type: actionTypes.delegateRegisteredFailure,
      data: {
        error: '',
      },
    };
    const stateRegisterFailure = delegate(state, action);
    expect(stateRegisterFailure).to.deep.equal({
      registerStep: 'register-failure',
      registerError: action.data,
    });
  });

  it('should not modify state when account updated with no delegate', () => {
    const action = {
      type: actionTypes.accountUpdated,
      data: {
      },
    };
    const stateAccountUpdatedNoDelegate = delegate(state, action);
    expect(stateAccountUpdatedNoDelegate).to.deep.equal({});
  });
});
