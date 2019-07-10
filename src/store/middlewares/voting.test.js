import { expect } from 'chai';
import { spy, stub, mock } from 'sinon';
import actionTypes from '../../constants/actions';
import * as delegateApi from '../../utils/api/delegates';
import middleware from './voting';
import networks from '../../constants/networks';
import votingConst from '../../constants/voting';

describe('voting middleware', () => {
  let store;
  let next;

  const generateNVotes = (n, vote) => (
    [...Array(n)].map((item, i) => i).reduce((dict, value) => {
      dict[`genesis_${value}`] = vote;
      return dict;
    }, {})
  );

  const initStoreWithNVotes = (n, vote) => {
    store.getState = () => ({
      voting: {
        votes: {
          ...generateNVotes(n, vote),
          test2: {
            unconfirmed: false,
            confirmed: false,
          },
        },
      },
    });
  };

  beforeEach(() => {
    store = stub();
    initStoreWithNVotes(
      votingConst.maxCountOfVotesInOneTurn + 1,
      { confirmed: false, unconfirmed: true },
    );
    store.dispatch = spy();
    next = spy();
  });

  it('should passes the action to next middleware', () => {
    const givenAction = {
      type: 'TEST_ACTION',
    };

    middleware(store)(next)(givenAction);
    expect(next).to.have.been.calledWith(givenAction);
  });

  describe('on accountLoggedOut action', () => {
    const state = {
      account: {
        info: {
          LSK: {
            address: '1243987612489124L',
          },
        },
      },
      voting: {
        delegates: [
          {
            username: 'delegate_in_store',
            publicKey: 'some publicKey',
          },
        ],
        votes: {
          delegate_voted: {
            unconfirmed: true,
            confirmed: true,
          },
          delegate_unvoted: {
            unconfirmed: false,
            confirmed: false,
          },
        },
      },
      peers: {
        liskAPIClient: {},
        options: {
          code: networks.mainnet.code,
        },
      },
    };
    let getDelegatesMock;

    beforeEach(() => {
      getDelegatesMock = mock(delegateApi).expects('getDelegates').returnsPromise();
      store.getState = () => (state);
    });

    afterEach(() => {
      getDelegatesMock.restore();
    });

    it('should clear delegates and votes on accountLoggedOut action', () => {
      middleware(store)(next)({
        type: actionTypes.accountLoggedOut,
      });

      expect(store.dispatch).to.have.been.calledWith({
        data: { list: [] },
        type: actionTypes.delegatesAdded,
      });
      expect(store.dispatch).to.have.been.calledWith({
        data: { list: [] },
        type: actionTypes.votesAdded,
      });
    });
  });
});
