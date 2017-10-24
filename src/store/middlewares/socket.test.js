import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './socket';
import * as socket from '../../utils/socket';
import actionTypes from '../../constants/actions';

describe('Socket middleware', () => {
  let store;
  let next;
  let socketSetup;
  let closeConnection;

  beforeEach(() => {
    next = spy();
    store = stub();
  });

  it('should call socketSetup after login', () => {
    socketSetup = stub(socket, 'socketSetup');

    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    expect(socketSetup).to.have.been.calledWith();
    socketSetup.restore();
  });

  it('should close the connection after logout', () => {
    closeConnection = stub(socket, 'closeConnection');

    middleware(store)(next)({ type: actionTypes.accountLoggedOut });
    expect(closeConnection).to.have.been.calledWith();
    closeConnection.restore();
  });

  it('should passes the action to next middleware', () => {
    socketSetup = stub(socket, 'socketSetup');

    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    expect(next).to.have.been.calledWith();
    socketSetup.restore();
  });
});

