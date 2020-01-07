import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { toast } from 'react-toastify';
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
    store.dispatch = () => {};
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

  it(`should fire error toaster on ${actionType.liskAPIClientUpdate} action if !action.data.online and state.network.status.online and action.data.code`, () => {
    network.status.online = true;
    action.data = {
      online: false,
      code: 'ANY OTHER CODE',
    };
    toast.error = spy();

    middleware(store)(next)(action);
    expect(toast.error).to.have.been.calledWith('Failed to connect to node');
  });

  it(`should fire error toaster on ${actionType.liskAPIClientUpdate} action if !action.data.online and state.network.status.online and action.data.code = "EUNAVAILABLE"`, () => {
    network.status.online = true;
    action.data = {
      online: false,
      code: 'EUNAVAILABLE',
    };
    toast.error = spy();

    middleware(store)(next)(action);
    expect(toast.error).to.have.been.calledWith(
      `Failed to connect: Node ${network.networks.LSK.nodeUrl} is not active`,
    );
  });

  it(`should fire error toaster on ${actionType.liskAPIClientUpdate} action if !action.data.online and state.network.status.online and action.data.code = "EPARSE"`, () => {
    network.status.online = true;
    action.data = {
      online: false,
      code: 'EPARSE',
    };
    toast.error = spy();

    const expectedResult = 'Failed to connect to node Make sure that you are using the latest version of Lisk.';
    middleware(store)(next)(action);
    expect(toast.error).to.have.been.calledWith(expectedResult);
  });

  it.skip(`should fire error toaster on ${actionType.liskAPIClientUpdate} action if action.data.online and !state.network.status.online`, () => {
    network.status.online = false;
    action.data.online = true;
    toast.error = spy();

    middleware(store)(next)(action);
    expect(toast.error).to.have.been.calledWith('Connection re-established');
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
