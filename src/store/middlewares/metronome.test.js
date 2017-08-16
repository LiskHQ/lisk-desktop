import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './metronome';
import actionTypes from '../../constants/actions';
import * as MetronomeService from '../../utils/metronome';

describe('Metronome middleware', () => {
  let store;
  let next;

  beforeEach(() => {
    next = spy();
    store = stub();
    store.dispatch = spy();
  });

  it(`should call Metronome constructor on ${actionTypes.accountLoggedIn} action`, () => {
    const metronome = spy(MetronomeService, 'default');
    middleware(store);
    expect(metronome.calledWithNew()).to.equal(true);
    expect(metronome).to.have.been.calledWith(store.dispatch);
    metronome.restore();
  });

  it('should call Metronome init method', () => {
    const spyFn = spy(MetronomeService.default.prototype, 'init');
    middleware(store)(next)({ type: actionTypes.accountLoggedIn });
    expect(spyFn).to.have.been.calledWith();
  });

  it(`should call metronome.terminate on ${actionTypes.accountLoggedOut} action`, () => {
    const spyFn = spy(MetronomeService.default.prototype, 'terminate');
    middleware(store)(next)({ type: actionTypes.accountLoggedOut });
    expect(spyFn).to.have.been.calledWith();
  });

  it('should passes the action to next middleware', () => {
    const expectedAction = {
      type: 'TEST_ACTION',
    };
    middleware(store)(next)(expectedAction);
    expect(next).to.have.been.calledWith(expectedAction);
  });
});

