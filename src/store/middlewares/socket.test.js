import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './socket';
import * as socket from '../../utils/socket';
import actionTypes from '../../constants/actions';

describe('Socket middleware', () => {
  let store;
  let next;
  let socketSetup;

  beforeEach(() => {
    next = spy();
    store = stub();
  });

  it('should call socketSetup when metronome is initialized', () => {
    socketSetup = stub(socket, 'socketSetup');

    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    expect(socketSetup).to.have.been.calledWith();
    socketSetup.reset();
  });

  it('should passes the action to next middleware', () => {
    const expectedAction = {
      type: actionTypes.accountLoggedIn,
    };
    middleware(store)(next)(expectedAction);
    expect(next).to.have.been.calledWith();
  });
});

