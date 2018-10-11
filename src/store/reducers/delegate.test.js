import { expect } from 'chai';
import actionTypes from '../../constants/actions';
import delegate from './delegate';

describe('Reducer: delegate(state, action)', () => {
  let state;

  beforeEach(() => {
    state = {
    };
  });

  it('should set delegateNameQueried flag', () => {
    const action = {
      type: actionTypes.delegateRetrieving,
      data: {
      },
    };
    const stateHasQueriedFlag = delegate(state, action);
    expect(stateHasQueriedFlag).to.deep.equal({
      delegateNameQueried: true,
    });
  });

  it('should reset delegateNameQueried flag and invalidate delegateName', () => {
    const action = {
      type: actionTypes.delegateRetrieved,
      data: {
        delegate: null,
      },
    };
    const stateValidUsername = delegate(state, action);
    expect(stateValidUsername).to.deep.equal({
      delegateNameQueried: false,
      delegateNameInvalid: false,
    });
  });

  it('should reset delegateNameQueried flag and invalidate delegateName', () => {
    const action = {
      type: actionTypes.delegateRetrieved,
      data: {
        delegate: {
          username: 'sample_username',
        },
      },
    };
    const stateNotValidUsername = delegate(state, action);
    expect(stateNotValidUsername).to.deep.equal({
      delegateNameQueried: false,
      delegateNameInvalid: true,
    });
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
