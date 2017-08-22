import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './loadingBar';
import actionType from '../../constants/actions';


describe('LoadingBar middleware', () => {
  let store;
  let next;
  const ignoredLoadingActionKeys = ['loader/status'];

  beforeEach(() => {
    store = stub();
    store.dispatch = spy();
    next = spy();
  });

  it('should pass the action to next middleware on some random action', () => {
    const randomAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(randomAction);
    expect(next).to.have.been.calledWith(randomAction);
  });

  it(`should not call next on ${actionType.loadingStarted} action if action.data == '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionType.loadingStarted,
      data: ignoredLoadingActionKeys[0],
    };

    middleware(store)(next)(action);
    expect(next).not.to.have.been.calledWith(action);
  });

  it(`should not call next on ${actionType.loadingFinished} action if action.data == '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionType.loadingFinished,
      data: ignoredLoadingActionKeys[0],
    };

    middleware(store)(next)(action);
    expect(next).not.to.have.been.calledWith(action);
  });

  it(`should call next on ${actionType.loadingStarted} action if action.data != '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionType.loadingStarted,
      data: 'something/else',
    };

    middleware(store)(next)(action);
    expect(next).to.have.been.calledWith(action);
  });

  it(`should call next on ${actionType.loadingFinished} action if action.data != '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionType.loadingFinished,
      data: 'something/else',
    };

    middleware(store)(next)(action);
    expect(next).to.have.been.calledWith(action);
  });
});

