import i18next from 'i18next';

import { expect } from 'chai';
import { spy, stub } from 'sinon';

import { successToastDisplayed, errorToastDisplayed } from '../../actions/toaster';
import actionType from '../../constants/actions';
import middleware from './offline';


describe('Offline middleware', () => {
  let store;
  let next;
  let action;
  let peers;

  beforeEach(() => {
    store = stub();
    store.dispatch = spy();
    next = spy();
    action = {
      type: actionType.activePeerUpdate,
      data: {},
    };
    peers = {
      data: {
        port: 4000,
        currentPeer: 'localhost',
      },
      status: {},
    };
    store.getState = () => ({ peers });
  });

  it('should pass the action to next middleware on some random action', () => {
    const randomAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(randomAction);
    expect(next).to.have.been.calledWith(randomAction);
  });

  it(`should dispatch errorToastDisplayed on ${actionType.activePeerUpdate} action if !action.data.online and state.peer.status.online and action.data.code`, () => {
    peers.status.online = true;
    action.data = {
      online: false,
      code: 'ANY OTHER CODE',
    };

    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(errorToastDisplayed({
      label: `Failed to connect to node ${peers.data.currentPeer}:${peers.data.port}`,
    }));
  });

  it(`should dispatch errorToastDisplayed on ${actionType.activePeerUpdate} action if !action.data.online and state.peer.status.online and action.data.code = "EUNAVAILABLE"`, () => {
    peers.status.online = true;
    action.data = {
      online: false,
      code: 'EUNAVAILABLE',
    };

    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(errorToastDisplayed({
      label: i18next.t('Failed to connect: Node {{address}} is not active', { address: `${peers.data.currentPeer}:${peers.data.port}` }),
    }));
  });

  it(`should dispatch errorToastDisplayed on ${actionType.activePeerUpdate} action if !action.data.online and state.peer.status.online and action.data.code = "EPARSE"`, () => {
    peers.status.online = true;
    action.data = {
      online: false,
      code: 'EPARSE',
    };

    const expectedResult = `Failed to connect to node ${peers.data.currentPeer}:${peers.data.port} Make sure that you are using the latest version of Lisk Nano.`;
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(errorToastDisplayed({
      label: expectedResult,
    }));
  });

  it(`should dispatch successToastDisplayed on ${actionType.activePeerUpdate} action if action.data.online and !state.peer.status.online`, () => {
    peers.status.online = false;
    action.data.online = true;

    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(successToastDisplayed({
      label: 'Connection re-established',
    }));
  });

  it(`should not call next() on ${actionType.activePeerUpdate} action if action.data.online === state.peer.status.online`, () => {
    peers.status.online = false;
    action.data.online = false;

    middleware(store)(next)(action);
    expect(next).not.to.have.been.calledWith();
  });

  it(`should call next() on ${actionType.activePeerUpdate} action if action.data.online !== state.peer.status.online`, () => {
    peers.status.online = true;
    action.data.online = false;

    middleware(store)(next)(action);
    expect(next).to.have.been.calledWith(action);
  });
});
