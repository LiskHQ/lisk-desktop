import { expect } from 'chai';
import { spy } from 'sinon';
import middleware from './loadingBar';
import actionType from 'constants';


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

  it(`should not call next on ${actionType.loadingStarted} action if action.data == '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionType.loadingStarted,
      data: ignoredLoadingActionKeys[0],
    };

    middleware()(next)(action);
    expect(next).not.to.have.been.calledWith(action);
  });

  it(`should not call next on ${actionType.loadingFinished} action if action.data == '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionType.loadingFinished,
      data: ignoredLoadingActionKeys[0],
    };

    middleware()(next)(action);
    expect(next).not.to.have.been.calledWith(action);
  });

  it(`should call next on ${actionType.loadingStarted} action if action.data != '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionType.loadingStarted,
      data: 'something/else',
    };

    middleware()(next)(action);
    expect(next).to.have.been.calledWith(action);
  });

  it(`should call next on ${actionType.loadingFinished} action if action.data != '${ignoredLoadingActionKeys[0]}'`, () => {
    const action = {
      type: actionType.loadingFinished,
      data: 'something/else',
    };

    middleware()(next)(action);
    expect(next).to.have.been.calledWith(action);
  });
});
