import { expect } from 'chai';
import { spy } from 'sinon';
import actionTypes from '../actions/actionTypes';
import middleware from './loadingBar';

describe('LoadingBar middleware', () => {
  let next;
  const ignoredLoadingActionKeys = ['transactions'];

  beforeEach(() => {
    next = spy();
  });

  it('should pass the action to next middleware on some random action', () => {
    const randomAction = {
      type: 'TEST_ACTION',
    };

    middleware()(next)(randomAction);
    expect(next).to.have.been.calledWith(randomAction);
  });

  it(`should not call next on ${actionTypes.loadingStarted} action if action.data == '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionTypes.loadingStarted,
      data: ignoredLoadingActionKeys[0],
    };

    middleware()(next)(action);
    expect(next).not.to.have.been.calledWith(action);
  });

  it(`should not call next on ${actionTypes.loadingFinished} action if action.data == '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionTypes.loadingFinished,
      data: ignoredLoadingActionKeys[0],
    };

    middleware()(next)(action);
    expect(next).not.to.have.been.calledWith(action);
  });

  it(`should call next on ${actionTypes.loadingStarted} action if action.data != '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionTypes.loadingStarted,
      data: 'something/else',
    };

    middleware()(next)(action);
    expect(next).to.have.been.calledWith(action);
  });

  it(`should call next on ${actionTypes.loadingFinished} action if action.data != '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionTypes.loadingFinished,
      data: 'something/else',
    };

    middleware()(next)(action);
    expect(next).to.have.been.calledWith(action);
  });
});
