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
  let network;
  let settings;

  beforeEach(() => {
    store = stub();
    store.dispatch = spy();
    next = spy();
    action = {
      type: actionType.liskAPIClientUpdate,
      data: {},
    };
    settings = {
      token: {
        active: 'LSK',
      },
    };
    network = {
      status: { online: true },
      name: 'Custom Node',
      networks: {
        LSK: {
          nodeUrl: 'hhtp://localhost:4000',
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        },
      },
    };
    store.getState = () => ({ network, settings });
  });

  it('should pass the action to next middleware on some random action', () => {
    const randomAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(randomAction);
    expect(next).to.have.been.calledWith(randomAction);
  });

  it(`should dispatch errorToastDisplayed on ${actionType.liskAPIClientUpdate} action if !action.data.online and state.network.status.online and action.data.code`, () => {
    network.status.online = true;
    action.data = {
      online: false,
      code: 'ANY OTHER CODE',
    };

    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(errorToastDisplayed({
      label: 'Failed to connect to node',
    }));
  });

  it(`should dispatch errorToastDisplayed on ${actionType.liskAPIClientUpdate} action if !action.data.online and state.network.status.online and action.data.code = "EUNAVAILABLE"`, () => {
    network.status.online = true;
    action.data = {
      online: false,
      code: 'EUNAVAILABLE',
    };

    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(errorToastDisplayed({
      label: i18next.t('Failed to connect: Node {{address}} is not active', { address: `${network.networks.LSK.nodeUrl}` }),
    }));
  });

  it(`should dispatch errorToastDisplayed on ${actionType.liskAPIClientUpdate} action if !action.data.online and state.network.status.online and action.data.code = "EPARSE"`, () => {
    network.status.online = true;
    action.data = {
      online: false,
      code: 'EPARSE',
    };

    const expectedResult = 'Failed to connect to node Make sure that you are using the latest version of Lisk Hub.';
    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(errorToastDisplayed({
      label: expectedResult,
    }));
  });

  it(`should dispatch successToastDisplayed on ${actionType.liskAPIClientUpdate} action if action.data.online and !state.network.status.online`, () => {
    network.status.online = false;
    action.data.online = true;

    middleware(store)(next)(action);
    expect(store.dispatch).to.have.been.calledWith(successToastDisplayed({
      label: 'Connection re-established',
    }));
  });

  it(`should not call next() on ${actionType.liskAPIClientUpdate} action if action.data.online === state.network.status.online`, () => {
    network.status.online = false;
    action.data.online = false;

    middleware(store)(next)(action);
    expect(next).not.to.have.been.calledWith();
  });

  it(`should call next() on ${actionType.liskAPIClientUpdate} action if action.data.online !== state.network.status.online`, () => {
    network.status.online = true;
    action.data.online = false;

    middleware(store)(next)(action);
    expect(next).to.have.been.calledWith(action);
  });
});
