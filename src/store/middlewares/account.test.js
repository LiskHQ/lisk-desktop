import { expect } from 'chai';
import { spy, stub } from 'sinon';
import middleware from './account';
import * as accountApi from '../../utils/api/account';
import actionTypes from '../../constants/actions';

describe('Account middleware', () => {
  let store;
  let next;

  beforeEach(() => {
    store = stub();
    store.getState = () => ({
      peers: {
        data: {},
      },
      account: {},
    });
    next = spy();
  });

  it('should passes the action to next middleware', () => {
    const expectedAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(expectedAction);
    expect(next).to.have.been.calledWith(expectedAction);
  });

  it(`should call account API methods on ${actionTypes.metronomeBeat} action`, () => {
    const stubGetAccount = stub(accountApi, 'getAccount').resolves(true);
    const stubGetAccountStatus = stub(accountApi, 'getAccountStatus').resolves(true);

    middleware(store)(next)({ type: actionTypes.metronomeBeat });

    expect(stubGetAccount).to.have.been.calledWith();
    expect(stubGetAccountStatus).to.have.been.calledWith();

    stubGetAccount.restore();
    stubGetAccountStatus.restore();
  });
});

